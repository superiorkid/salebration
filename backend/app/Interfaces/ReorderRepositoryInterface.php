<?php

namespace App\Interfaces;

use App\DTO\Params\ReorderFilterParams;
use App\DTO\ReorderDTO;
use App\Models\Reorder;
use Illuminate\Database\Eloquent\Collection;

interface ReorderRepositoryInterface
{
    public function findOneById(int $id): ?Reorder;
    public function create(ReorderDTO $reorderDTO, int $costPerItem, string $purchaseOrderNumber): ?Reorder;
    public function markAsReceive(Reorder $reorder): void;
    public function markAsCancel(Reorder $reorder, string $cancellationReason): void;
    public function findMany(?ReorderFilterParams $filters): Collection;
    public function findManyByVariantId(int $variantId): Collection;
    public function delete(Reorder $reorder): void;
    public function countReorderToday(): int;
    public function hasPendingReorder(int $variantId): bool;
    public function markAsAccepted(Reorder $reorder, string $acceptance_notes): void;
    public function markAsRejected(Reorder $reorder, string $rejection_reason): void;
    public function getLastReorder(int $variantId): ?Reorder;
    public function findReceivedReorder(): Collection;
}
