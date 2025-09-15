<?php

namespace App\Repositories;

use App\DTO\PurchaseOrderItemDTO;
use App\Interfaces\PurchaseOrderItemRepositoryInterface;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Collection;

class PurchaseOrderItemRepository implements PurchaseOrderItemRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create(PurchaseOrder $purchaseOrder, Collection $purchaseOrderItems): void
    {
        $purchaseOrder->purchaseOrderItems()->createMany(
            $purchaseOrderItems->map(function (PurchaseOrderItemDTO $item) {
                return [
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                ];
            })->all()
        );
    }

    public function updateReceivedQuantity(PurchaseOrderItem $purchaseOrderItem, int $receivedQuantity): void
    {
        $purchaseOrderItem->update([
            "received_quantity" => $receivedQuantity
        ]);
    }

    public function findOneById(int $id): ?PurchaseOrderItem
    {
        return PurchaseOrderItem::query()
            ->with(["productVariant","purchaseOrder"])
            ->find($id);
    }
}
