<?php

namespace App\Services;

use App\DTO\OrderAcceptedDTO;
use App\DTO\OrderCancelledDTO;
use App\DTO\OrderRejectedDTO;
use App\DTO\PurchaseOrderDTO;
use App\Enums\OrderStatusEnum;
use App\Interfaces\PurchaseOrderRepositoryInterface;
use App\Notifications\PurchaseOrderAcceptedNotification;
use App\Notifications\PurchaseOrderCancelledNotification;
use App\Notifications\PurchaseOrderNotification;
use App\Notifications\PurchaseOrderReceivedNotification;
use App\Notifications\PurchaseOrderRejectedNotification;
use App\Traits\TokenHelper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class PurchaseOrderService
{
    use TokenHelper;

    protected PurchaseOrderRepositoryInterface $purchaseOrderRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        PurchaseOrderRepositoryInterface $purchaseOrderRepositoryInterface,
    )
    {
        $this->purchaseOrderRepositoryInterface = $purchaseOrderRepositoryInterface;
    }

    public function purchaseOrders(): JsonResponse
    {
        try {
            $purchaseOrders = $this->purchaseOrderRepositoryInterface->findMany();
            return response()->json([
                "success" => true,
                "message" => "Successfully retrieved all purchase orders.",
                "data" => $purchaseOrders,
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detailPurchaseOrder(string $purchase_order_id): JsonResponse
    {
        try {
            $purchaseOrder = $this->purchaseOrderRepositoryInterface->findOneById((int)$purchase_order_id);
            if (empty($purchaseOrder)) {
                return response()->json([
                    "success" => false,
                    "message" => "Purchase order not found.",
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "message" => "Successfully retrieved purchase order.",
                "data" => $purchaseOrder,
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deletePurchaseOrder(string $purchase_order_id): JsonResponse
    {
        $purchaseOrder = $this->purchaseOrderRepositoryInterface->findOneById((int)$purchase_order_id);
        if (empty($purchaseOrder)) {
            return response()->json([
                "success" => false,
                "message" => "Purchase order not found.",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->purchaseOrderRepositoryInterface->delete($purchaseOrder);
            return response()->json([
                "success" => true,
                "message" => "Successfully delete purchase order.",
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createPurchaseOrder(PurchaseOrderDTO $purchaseOrderDTO): JsonResponse
    {
//        check for pending orders with same supplier
        $hasPendingOrder = $this->purchaseOrderRepositoryInterface->hasPendingOrderForSupplier($purchaseOrderDTO->supplier_id);
        if ($hasPendingOrder) {
            return response()->json([
                "success" => false,
                "message" => "Cannot create new order: Supplier has pending purchase orders.",
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            DB::beginTransaction();

            $purchaseOrder = $this->purchaseOrderRepositoryInterface->create($purchaseOrderDTO);

            $token = $this->generatePurchaseOrderToken(
                $purchaseOrder->id,
                $purchaseOrderDTO->supplier_id,
                3);
            $purchaseOrder->supplier->notify(new PurchaseOrderNotification($purchaseOrder, $token));

            // TODO -> add to activity log

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Successfully create purchase order.",
            ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function markAsAccepted(
        int $purchase_order_id,
        string $token,
        OrderAcceptedDTO $purchaseOrderAcceptedDTO
    ): JsonResponse
    {
        $tokenData = $this->validateOrderToken($token);
        if ($tokenData["order_id"] !== $purchase_order_id) {
            return response()->json([
                "success" => false,
                "message" => "Token does not match this order"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        $purchaseOrder = $this->purchaseOrderRepositoryInterface->findOneById($purchase_order_id);
        if (empty($purchaseOrder)) {
            return response()->json([
                "success" => false,
                "message" => "Purchase order not found.",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($purchaseOrder->status !== OrderStatusEnum::PENDING->value) {
            return response()->json([
                "success" => false,
                "message" => "Order is already {$purchaseOrder->status}",
            ], JsonResponse::HTTP_CONFLICT);
        }

        if ($purchaseOrder->supplier_id !== $tokenData["supplier_id"]) {
            return response()->json([
                "success" => false,
                "message" => "You are not authorized to accept this order"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            DB::beginTransaction();

            $this->purchaseOrderRepositoryInterface->markAsAccepted(
                $purchaseOrder,
                $purchaseOrderAcceptedDTO->acceptance_notes
            );

            Notification::route("mail", config("mail.admin.address"))
                ->notify(new PurchaseOrderAcceptedNotification($purchaseOrder));

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Order successfully accepted.",
                "data" => $purchaseOrder,
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

    public function markAsRejected(
        int $purchase_order_id,
        string $token,
        OrderRejectedDTO $purchaseOrderRejectedDTO
    ): JsonResponse
    {
        $tokenData=  $this->validateOrderToken($token);
        if ($tokenData["order_id"] !== $purchase_order_id) {
            return response()->json([
                "success" => false,
                "message" => "Token does not match this order"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        $purchaseOrder = $this->purchaseOrderRepositoryInterface->findOneById($purchase_order_id);
        if (empty($purchaseOrder)) {
            return response()->json([
                "success" => false,
                "message" => "Purchase order not found.",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($purchaseOrder->status !== OrderStatusEnum::PENDING->value) {
            return response()->json([
                "success" => false,
                "message" => "Order is already {$purchaseOrder->status}",
            ], JsonResponse::HTTP_CONFLICT);
        }

        if ($purchaseOrder->supplier_id !== $tokenData["supplier_id"]) {
            return response()->json([
                "success" => false,
                "message" => "You are not authorized to rejected this order"
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        try {
            DB::beginTransaction();

            $this->purchaseOrderRepositoryInterface->markAsRejected(
                $purchaseOrder,
                $purchaseOrderRejectedDTO->rejection_reason
            );

            Notification::route("mail", config("mail.admin.address"))
                ->notify(new PurchaseOrderRejectedNotification($purchaseOrder));

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Order successfully rejected.",
                "data" => $purchaseOrder,
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

    public function markAsCancelled(
        int $purchase_order_id,
        OrderCancelledDTO $purchaseOrderCancelledDTO
    ): JsonResponse
    {
        $purchaseOrder = $this->purchaseOrderRepositoryInterface->findOneById($purchase_order_id);
        if (empty($purchaseOrder)) {
            return response()->json([
                "success" => false,
                "message" => "Purchase order not found.",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($purchaseOrder->status === OrderStatusEnum::RECEIVED->value) {
            return response()->json([
                "success" => false,
                "message" => "Cannot cancel already received orders"
            ], JsonResponse::HTTP_CONFLICT);
        }

        if ($purchaseOrder->status === OrderStatusEnum::CANCELLED->value) {
            return response()->json([
                "success" => false,
                "message" => "This reorder is already cancelled"
            ], JsonResponse::HTTP_CONFLICT);
        }

        try {
            DB::beginTransaction();

            $this->purchaseOrderRepositoryInterface->markAsCancelled($purchaseOrder, $purchaseOrderCancelledDTO->cancellation_reason);
            $purchaseOrder->supplier->notify(
                new PurchaseOrderCancelledNotification(
                    purchaseOrder: $purchaseOrder,
                    cancelled_by: auth()->user(),
                    cancellation_reason: $purchaseOrderCancelledDTO->cancellation_reason,
                )
            );

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Order successfully cancelled.",
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

    public function checkPurchaseOrderCompletion(int $purchase_order_id): void
    {
        $purchaseOrder = $this->purchaseOrderRepositoryInterface->findOneById($purchase_order_id);
        if (empty($purchaseOrder)) {
            throw new Exception("Purchase order not found.");
        }

        try {
            $allItemReceived = $purchaseOrder->purchaseOrderItems->every(function ($item){
                return $item->received_quantity >= $item->quantity;
            });

            if ($allItemReceived) {
                $this->purchaseOrderRepositoryInterface->markAsReceive($purchaseOrder);

                $purchaseOrder->supplier->notify(
                    new PurchaseOrderReceivedNotification($purchaseOrder)
                );
            } else {
                $this->purchaseOrderRepositoryInterface->markAsPartial($purchaseOrder);
            }
        } catch (Exception $e){
            throw new Exception(
                "An error occurred while checking purchase order completion: " . $e->getMessage(),
                0,
                $e
            );
        }
    }
}
