<?php

namespace App\Interfaces;

use App\DTO\Params\PurchaseOrderFilterParams;
use App\DTO\PurchaseOrderDTO;
use App\Models\PurchaseOrder;
use Illuminate\Support\Collection;

interface PurchaseOrderRepositoryInterface
{
    public function findOneById(int $id): ?PurchaseOrder;
    public function findOneByPoNumber(string $poNumber): ?PurchaseOrder;
    public function create(PurchaseOrderDTO $purchaseOrderDTO): ?PurchaseOrder;
    public function delete(PurchaseOrder $purchaseOrder): void;
    public function findMany(): Collection;
    public function markAsAccepted(PurchaseOrder $purchaseOrder, string $acceptance_notes): void;
    public function markAsRejected(PurchaseOrder $purchaseOrder, string $rejection_reason): void;
    public function markAsCancelled(PurchaseOrder $purchaseOrder, string $cancellation_reason): void;
    public function markAsReceive(PurchaseOrder $purchaseOrder): void;
    public function markAsPartial(PurchaseOrder $purchaseOrder): void;
    public function hasPendingOrderForSupplier(int $supplierId): bool;
    public function findReceivedReorder(?PurchaseOrderFilterParams $filters): Collection;
}
