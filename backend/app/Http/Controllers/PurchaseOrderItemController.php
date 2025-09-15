<?php

namespace App\Http\Controllers;

use App\DTO\UpdatePurchaseOrderItemQuantityDTO;
use App\Services\PurchaseOrderItemService;
use Illuminate\Http\JsonResponse;

class PurchaseOrderItemController extends Controller
{
    protected PurchaseOrderItemService $purchaseOrderItemService;

    public function __construct(
        PurchaseOrderItemService $purchaseOrderItemService
    )
    {
        $this->purchaseOrderItemService = $purchaseOrderItemService;
    }

    public function updateReceivedQuantity(
        UpdatePurchaseOrderItemQuantityDTO $updatePurchaseOrderItemQuantityDTO,
        string $purchase_order_item_id
    ): JsonResponse
    {
        return $this->purchaseOrderItemService->updateReceivedQuantity(
            $updatePurchaseOrderItemQuantityDTO,
            (int) $purchase_order_item_id,
        );
    }
}
