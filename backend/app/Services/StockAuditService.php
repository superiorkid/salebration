<?php

namespace App\Services;

use App\DTO\StockAuditDTO;
use App\DTO\StockHistoryDTO;
use App\Enums\StockHistoryTypeEnum;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Interfaces\StockAuditRepositoryInterface;
use App\Interfaces\StockHistoryRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StockAuditService
{
    protected StockAuditRepositoryInterface $stockAuditRepositoryInterface;
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;
    protected StockHistoryRepositoryInterface $stockHistoryRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        StockAuditRepositoryInterface $stockAuditRepositoryInterface,
        ProductVariantRepositoryInterface $productVariantRepositoryInterface,
        StockHistoryRepositoryInterface $stockHistoryRepositoryInterface
    )
    {
        $this->stockAuditRepositoryInterface = $stockAuditRepositoryInterface;
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
        $this->stockHistoryRepositoryInterface = $stockHistoryRepositoryInterface;
    }

    public function stockAudits(int $variantId): JsonResponse
    {
        $productVariant = $this->productVariantRepositoryInterface->findOneById($variantId);
        if (empty($productVariant)){
            return response()->json([
                "success" => false,
                "message" => "Product variant not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $audits = $this->stockAuditRepositoryInterface->findManyByProductVariantId($variantId);
            return response()->json([
                "success" => true,
                "message" => "Stock audits retrieved successfully.",
                "data" => $audits
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createStockAudit(StockAuditDTO $stockAuditDTO): JsonResponse
    {
        $productVariant = $this->productVariantRepositoryInterface->findOneById($stockAuditDTO->product_variant_id);
        if (empty($productVariant)){
            return response()->json([
                "success" => false,
                "message" => "Product variant not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();

            $systemQuantity = $productVariant->quantity;
            $stockAudit = $this->stockAuditRepositoryInterface->create($stockAuditDTO, $systemQuantity);

            $difference = $stockAudit->difference;


            // update stock
            if ($stockAudit->difference !== 0) {
                $beforeQuantity = $productVariant->quantity;

                if ($stockAudit->difference < 0) {
                    $this->productVariantRepositoryInterface->decrementQuantity(
                        $stockAudit->productVariant,
                        abs($stockAudit->difference)
                    );
                } else {
                    $this->productVariantRepositoryInterface->incrementQuantity(
                        $stockAudit->productVariant,
                        $stockAudit->difference
                    );
                }

                $afterQuantity = $productVariant->fresh()->quantity;
                $stockHistoryDto = new StockHistoryDTO(
                    product_variant_id: $productVariant->id,
                    type: StockHistoryTypeEnum::AUDIT->value,
                    quantity_before: $beforeQuantity,
                    quantity_after: $afterQuantity,
                    quantity_change: $difference,
                    notes: 'Stock adjusted from audit'
                );
                $this->stockHistoryRepositoryInterface->create($stockHistoryDto, $stockAudit);
            }

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Stock audit recorded.",
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteStockAudit(int $stockAuditId): JsonResponse
    {
        $stockAudit = $this->stockAuditRepositoryInterface->findOneById($stockAuditId);
        if (empty($stockAudit)){
            return response()->json([
                "success" => false,
                "message" => "Stock audit not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();

            $productVariant = $stockAudit->productVariant;
            $beforeQuantity = $productVariant->quantity;

            if ($stockAudit->difference !== 0) {
                if ($stockAudit->difference < 0) {
                    $this->productVariantRepositoryInterface->incrementQuantity(
                        $stockAudit->productVariant,
                        abs($stockAudit->difference)
                    );
                } else {
                    $this->productVariantRepositoryInterface->decrementQuantity(
                        $stockAudit->productVariant,
                        abs($stockAudit->difference)
                    );
                }

                $afterQuantity = $productVariant->fresh()->quantity;

                $stockHistoryDto = new StockHistoryDTO(
                    product_variant_id: $productVariant->id,
                    type: StockHistoryTypeEnum::ADJUSTMENT->value,
                    quantity_before: $beforeQuantity,
                    quantity_after: $afterQuantity,
                    quantity_change: $afterQuantity - $beforeQuantity,
                    notes: "Reversed stock audit adjustment (audit ID: {$stockAudit->id})"
                );
                $this->stockHistoryRepositoryInterface->create($stockHistoryDto, $stockAudit);
            }

            $this->stockAuditRepositoryInterface->delete($stockAudit);

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Stock audit deleted successfully."
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
