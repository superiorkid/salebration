<?php

namespace App\Interfaces;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Collection;

interface PurchaseOrderItemRepositoryInterface
{
    public function create(PurchaseOrder $purchaseOrder, Collection $purchaseOrderItems): void;
    public function updateReceivedQuantity(PurchaseOrderItem $purchaseOrderItem, int $receivedQuantity): void;
    public function findOneById(int $id): ?PurchaseOrderItem;
}
