<?php

namespace App\Http\Controllers;

use App\DTO\OrderAcceptedDTO;
use App\DTO\OrderCancelledDTO;
use App\DTO\PurchaseOrderDTO;
use App\DTO\OrderRejectedDTO;
use App\Services\PurchaseOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    public PurchaseOrderService $purchaseOrderService;

    public function __construct(
        PurchaseOrderService $purchaseOrderService
    )
    {
        $this->purchaseOrderService = $purchaseOrderService;
    }

    public function purchaseOrders(): JsonResponse
    {
        return $this->purchaseOrderService->purchaseOrders();
    }

    public function createPurchaseOrder(PurchaseOrderDTO $purchaseOrderDTO): JsonResponse
    {
        return $this->purchaseOrderService->createPurchaseOrder($purchaseOrderDTO);
    }

    public function detailPurchaseOrder(string $purchase_order_id): JsonResponse
    {
        return $this->purchaseOrderService->detailPurchaseOrder($purchase_order_id);

    }

    public function deletePurchaseOrder(string $purchase_order_id): JsonResponse
    {
        return $this->purchaseOrderService->deletePurchaseOrder($purchase_order_id);
    }

    public function markAsAccept(
        Request          $request,
        OrderAcceptedDTO $purchaseOrderAcceptedDTO,
        string           $purchase_order_id,
    ): JsonResponse
    {
        $token = $request->query("token");
        return $this->purchaseOrderService->markAsAccepted((int)$purchase_order_id, $token, $purchaseOrderAcceptedDTO);
    }

    public function markAsReject(
        Request          $request,
        OrderRejectedDTO $purchaseOrderRejectedDTO,
        string           $purchase_order_id,
    ): JsonResponse
    {
        $token = $request->query("token");
        return $this->purchaseOrderService->markAsRejected(
            $purchase_order_id,
            $token,
            $purchaseOrderRejectedDTO
        );
    }


    public function markAsCancel(
        OrderCancelledDTO $purchaseOrderCancelledDTO,
        string $purchase_order_id
    ): JsonResponse
    {
        return $this->purchaseOrderService->markAsCancelled(
            (int) $purchase_order_id,
            $purchaseOrderCancelledDTO
        );
    }
}
