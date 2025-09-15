<?php

namespace App\Services;

use App\DTO\StockHistoryDTO;
use App\DTO\UpdatePurchaseOrderItemQuantityDTO;
use App\Enums\StockHistoryTypeEnum;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Interfaces\StockHistoryRepositoryInterface;
use App\Repositories\PurchaseOrderItemRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PurchaseOrderItemService
{
    protected PurchaseOrderItemRepository $purchaseOrderItemRepository;
    protected PurchaseOrderService $purchaseOrderService;
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;
    protected StockHistoryRepositoryInterface $stockHistoryRepositoryInterface;


    /**
     * Create a new class instance.
     */
    public function __construct(
        PurchaseOrderItemRepository $purchaseOrderItemRepository,
        PurchaseOrderService $purchaseOrderService,
        ProductVariantRepositoryInterface $productVariantRepositoryInterface,
        StockHistoryRepositoryInterface $stockHistoryRepositoryInterface
    )
    {
        $this->purchaseOrderItemRepository = $purchaseOrderItemRepository;
        $this->purchaseOrderService = $purchaseOrderService;
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
        $this->stockHistoryRepositoryInterface = $stockHistoryRepositoryInterface;
    }

    public function updateReceivedQuantity(
        UpdatePurchaseOrderItemQuantityDTO $updatePurchaseOrderItemQuantityDTO,
        int $purchase_order_item_id
    ): JsonResponse
    {
        $purchaseOrderItem = $this->purchaseOrderItemRepository->findOneById($purchase_order_item_id);
        if (empty($purchaseOrderItem)) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Purchase Order Item not found'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $newQuantity = $updatePurchaseOrderItemQuantityDTO->received_quantity;

        if ($newQuantity < 0) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Received quantity cannot be negative'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($newQuantity > $purchaseOrderItem->quantity) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Received quantity cannot exceed ordered quantity of {$purchaseOrderItem->quantity}'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            DB::beginTransaction();

            $currentQuantity = $purchaseOrderItem->received_quantity;
            $diff = $newQuantity - $currentQuantity;

            // only update stock if newly received quantity increases
            if ($diff > 0) {
                $variant = $purchaseOrderItem->productVariant;

                $beforeQuantity = $variant->quantity;
                $this->productVariantRepositoryInterface->incrementQuantity($variant, $diff);
                $afterQuantity = $beforeQuantity + $diff;

                $stockHistoryDto = new StockHistoryDTO(
                    product_variant_id: $variant->id,
                    type: StockHistoryTypeEnum::PURCHASE->value,
                    quantity_before: $beforeQuantity,
                    quantity_after: $afterQuantity,
                    quantity_change: $diff,
                    notes: "Partial receive from {$purchaseOrderItem->purchaseOrder->purchase_order_number}"
                );
                $this->stockHistoryRepositoryInterface->create($stockHistoryDto, $purchaseOrderItem);
            }

            $this->purchaseOrderItemRepository
                ->updateReceivedQuantity($purchaseOrderItem, $updatePurchaseOrderItemQuantityDTO->received_quantity);
            $this->purchaseOrderService->checkPurchaseOrderCompletion($purchaseOrderItem->purchase_order_id);

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Received quantity updated successfully"
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
