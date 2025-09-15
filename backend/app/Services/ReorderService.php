<?php

namespace App\Services;

use App\DTO\CancelReorderDTO;
use App\DTO\OrderAcceptedDTO;
use App\DTO\OrderRejectedDTO;
use App\DTO\ReorderDTO;
use App\DTO\StockHistoryDTO;
use App\DTO\ValidateReorderTokenDTO;
use App\Enums\OrderStatusEnum;
use App\Enums\StockHistoryTypeEnum;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Interfaces\ReorderRepositoryInterface;
use App\Interfaces\StockHistoryRepositoryInterface;
use App\Notifications\ProductReorderNotification;
use App\Notifications\ReorderAcceptedNotification;
use App\Notifications\ReorderCancelledNotification;
use App\Notifications\ReorderRejectedNotification;
use App\Traits\TokenHelper;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ReorderService
{
    use TokenHelper;

    protected ReorderRepositoryInterface $reorderRepositoryInterface;
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;
    protected DocumentNumberService $documentNumberService;
    protected StockHistoryRepositoryInterface $stockHistoryRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        ReorderRepositoryInterface $reorderRepositoryInterface,
        ProductVariantRepositoryInterface $productVariantRepositoryInterface,
        DocumentNumberService $documentNumberService,
        StockHistoryRepositoryInterface $stockHistoryRepositoryInterface
    )
    {
        $this->reorderRepositoryInterface = $reorderRepositoryInterface;
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
        $this->documentNumberService = $documentNumberService;
        $this->stockHistoryRepositoryInterface = $stockHistoryRepositoryInterface;
    }

    public function findAll(): JsonResponse
    {
        try {
            $reorders = $this->reorderRepositoryInterface->findMany();

            // TODO: add to activity

            return response()->json([
                'success' => true,
                'reorders' => $reorders,
                'data' => $reorders,
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createReorder(ReorderDTO $reorderDTO): JsonResponse
    {
        $productVariant = $this->productVariantRepositoryInterface->findOneById($reorderDTO->product_variant_id);
        if (empty($productVariant)) {
            return response()->json([
                "success" => false,
                "message" => "Product variant not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $lastReorder = $this->reorderRepositoryInterface->getLastReorder($reorderDTO->product_variant_id);
        if ($lastReorder && in_array(
            $lastReorder->status, [OrderStatusEnum::PENDING->value, OrderStatusEnum::ACCEPTED->value])
        ) {
            return response()->json([
                "success" => false,
                "message" => "Cannot create new reorder. The last reorder for this variant is still {$lastReorder->status}",
                "data" => [
                    "last_reorder" => [
                        "po_number" => $lastReorder->purchase_order_number,
                        "status" => $lastReorder->status,
                        "created_at" => $lastReorder->created_at->format('Y-m-d H:i:s')
                    ]
                ]
            ], JsonResponse::HTTP_CONFLICT);
        }

        $basePrice = $productVariant->product->base_price;
        $additionalPrice= $productVariant->additional_price;
        $costPerItem = $basePrice + $additionalPrice;

        $roNumber = $this->documentNumberService->generateReorderNumber();

        try {
            DB::beginTransaction();

            $reorder = $this->reorderRepositoryInterface->create($reorderDTO, $costPerItem, $roNumber);

            $supplier = $productVariant->product->supplier;

            $token = $this->generateReorderToken($reorder->id, $supplier->id, 3);

            // send order email to supplier
            $productVariant->product->supplier->notify(
                new ProductReorderNotification(
                    product: $productVariant->product,
                    reorder: $reorder,
                    variant: $productVariant,
                    supplier: $supplier,
                    costPerItem: $costPerItem,
                    totalCost: $costPerItem * $reorderDTO->quantity,
                    token: $token
                )
            );

            DB::commit();

            return response()->json([
               "success" => true,
               "message" => "Reorder successfully created"
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e){
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function findOneById(int $reorderId): JsonResponse
    {
        try {
            $reorder = $this->reorderRepositoryInterface->findOneById($reorderId);
            if (empty($reorder)) {
                return response()->json([
                    "success" => false,
                    "message" => "Reorder not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "message" => "Reorder successfully found",
                "data" => $reorder,
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function markAsReceive(int $reorder_id): JsonResponse
    {
        $reorder = $this->reorderRepositoryInterface->findOneById($reorder_id);
        if (empty($reorder)) {
            return response()->json([
                "success" => false,
                "message" => "Reorder not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($reorder->status === OrderStatusEnum::RECEIVED->value) {
            return response()->json([
                "success" => false,
                "message" => "This reorder is already received"
            ], JsonResponse::HTTP_CONFLICT);
        }

        try {
            DB::beginTransaction();

            $this->reorderRepositoryInterface->markAsReceive($reorder);

            $beforeQuantity = $reorder->product_variant->quantity;
            $this->productVariantRepositoryInterface->incrementQuantity($reorder->product_variant, $reorder->quantity);
            $afterQuantity = $beforeQuantity + $reorder->quantity;

            $stockHistoryDto = new StockHistoryDTO(
                product_variant_id: $reorder->product_variant->id,
                type: StockHistoryTypeEnum::REORDER->value,
                quantity_before: $beforeQuantity,
                quantity_after: $afterQuantity,
                quantity_change: $reorder->quantity,
                notes: 'Reorder received'
            );
            $this->stockHistoryRepositoryInterface->create($stockHistoryDto, $reorder);

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Reorder successfully marked as received"
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

    public function markAsCancel(int $reorder_id, CancelReorderDTO $cancelReorderDTO): JsonResponse
    {
        $reorder = $this->reorderRepositoryInterface->findOneById($reorder_id);
        if (empty($reorder)) {
            return response()->json([
                "success" => false,
                "message" => "Reorder not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($reorder->status === OrderStatusEnum::RECEIVED->value) {
            return response()->json([
                "success" => false,
                "message" => "Cannot cancel already received orders"
            ], JsonResponse::HTTP_CONFLICT);
        }

        if ($reorder->status === OrderStatusEnum::CANCELLED->value) {
            return response()->json([
                "success" => false,
                "message" => "This reorder is already cancelled"
            ], JsonResponse::HTTP_CONFLICT);
        }

        try {
            DB::beginTransaction();

            $this->reorderRepositoryInterface->markAsCancel($reorder, $cancelReorderDTO->cancellation_reason);

            $reorder->product_variant->product->supplier->notify(
                new ReorderCancelledNotification(
                    reorder: $reorder,
                    cancelled_by: auth()->user(),
                    supplier: $reorder->product_variant->product->supplier,
                    reason: $cancelReorderDTO->cancellation_reason
                )
            );

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Reorder successfully marked as cancelled"
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

    public function deleteReorder(int $reorder_id): JsonResponse
    {
        $reorder = $this->reorderRepositoryInterface->findOneById($reorder_id);
        if (empty($reorder)) {
            return response()->json([
                "success" => false,
                "message" => "Reorder not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->reorderRepositoryInterface->delete($reorder);

            // TODO: activity log

            return response()->json([
                "success" => true,
                "message" => "Reorder successfully deleted"
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e){
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function reorderTokenValidation(ValidateReorderTokenDTO $validateReorderTokenDTO): JsonResponse
    {
        try {
            $tokenData = $this->validateOrderToken($validateReorderTokenDTO->token);
            if ($tokenData["reorder_id"] !== $validateReorderTokenDTO->reorder_id) {
                return response()->json([
                    "success" => false,
                    "message" => "Token does not match this reorder"
                ], JsonResponse::HTTP_FORBIDDEN);
            }

            $reorder = $this->reorderRepositoryInterface->findOneById($tokenData["reorder_id"]);
            if (empty($reorder)) {
                return response()->json([
                    "success" => false,
                    "message" => "Reorder not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            if ($reorder->status !== OrderStatusEnum::PENDING->value) {
                return response()->json([
                    "success" => false,
                    "message" => "This reorder has already been processed"
                ], JsonResponse::HTTP_CONFLICT);
            }

            return response()->json([
                "success" => true,
                "message" => "Reorder successfully marked as processed",
                "data" => [
                    "reorder_id" => $tokenData["reorder_id"],
                    "supplier_id" => $tokenData["supplier_id"],
                    "expires_at" => $tokenData["expires_at"],
                    "reorder" => $reorder
                ]
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function markAsAccept(
        int $reorder_id,
        string $token,
        OrderAcceptedDTO $orderAcceptedDTO
    ): JsonResponse
    {
        $tokenData = $this->validateOrderToken($token);
        if ($tokenData["order_id"] !== $reorder_id) {
            return response()->json([
                "success" => false,
                "message" => "Token does not match this reorder"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        $reorder = $this->reorderRepositoryInterface->findOneById($reorder_id);
        if (empty($reorder)) {
            return response()->json([
                "success" => false,
                "message" => "Reorder not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($reorder->status !== OrderStatusEnum::PENDING->value) {
            return response()->json([
                "success" => false,
                "message" => "Reorder is already {$reorder->status}"
            ], JsonResponse::HTTP_CONFLICT);
        }

        if ($reorder->product_variant->product->supplier_id !== $tokenData["supplier_id"]) {
            return response()->json([
                "success" => false,
                "message" => "You are not authorized to accept this order"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            DB::beginTransaction();

            $this->reorderRepositoryInterface->markAsAccepted($reorder, $orderAcceptedDTO->acceptance_notes);

            // TODO: create an audit log -> here

            Notification::route(
                "mail",
                config('mail.admin.address')
            )->notify(new ReorderAcceptedNotification($reorder));

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Reorder successfully updated",
                "data" => $reorder,
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


    public function markAsReject(
        int $reorder_id,
        string $token,
        OrderRejectedDTO $orderRejectedDTO
    ): JsonResponse
    {
        $tokenData = $this->validateOrderToken($token);
        if ($tokenData["order_id"] !== $reorder_id) {
            return response()->json([
                "success" => false,
                "message" => "Token does not match this reorder"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        $reorder = $this->reorderRepositoryInterface->findOneById($reorder_id);
        if (empty($reorder)) {
            return response()->json([
                "success" => false,
                "message" => "Reorder not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($reorder->status !== OrderStatusEnum::PENDING->value) {
            return response()->json([
                "success" => false,
                "message" => "Reorder is already {$reorder->status}"
            ], JsonResponse::HTTP_CONFLICT);
        }

        if ($reorder->product_variant->product->supplier_id !== $tokenData["supplier_id"]) {
            return response()->json([
                "success" => false,
                "message" => "You are not authorized to accept this order"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            DB::beginTransaction();

            $this->reorderRepositoryInterface->markAsRejected($reorder, $orderRejectedDTO->rejection_reason);

            // TODO: create an audit log -> here

            Notification::route(
                "mail",
                config('mail.admin.address')
            )->notify(new ReorderRejectedNotification($reorder));

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Reorder successfully updated",
                "data" => $reorder,
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

    function generatePoNumber(): string
    {
        $date = Carbon::now()->format("Ymd");

        // count how many POs created today
        $countToday = $this->reorderRepositoryInterface->countReorderToday();
        $increment = str_pad($countToday + 1, 4, "0", STR_PAD_LEFT);
        return "PO-{$date}-{$increment}";
    }

}
