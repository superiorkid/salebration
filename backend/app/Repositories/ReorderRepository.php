<?php

namespace App\Repositories;

use App\DTO\Params\ReorderFilterParams;
use App\DTO\ReorderDTO;
use App\Enums\OrderStatusEnum;
use App\Interfaces\ReorderRepositoryInterface;
use App\Models\Reorder;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class ReorderRepository implements ReorderRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findOneById(int $id): ?Reorder
    {
        return Reorder::query()
            ->with(["product_variant.product.supplier"])
            ->find($id);
    }

    public function delete(Reorder $reorder): void
    {
        $reorder->delete();
    }

    public function findMany(?ReorderFilterParams $filters = null): Collection
    {
        $query =  Reorder::query()
            ->with(["product_variant.product.supplier"]);

        if ($filters && $filters->start_date && $filters->end_date) {
            $query->whereBetween('created_at', [
                Carbon::parse($filters->start_date)->startOfDay(),
                Carbon::parse($filters->end_date)->endOfDay()
            ]);
        }
        elseif ($filters && $filters->start_date) {
            $query->whereDate('created_at', '>=', Carbon::parse($filters->start_date));
        }
        elseif ($filters && $filters->end_date) {
            $query->whereDate('created_at', '<=', Carbon::parse($filters->end_date));
        }

        return $query->orderByDesc('created_at')->get();
    }

    public function create(ReorderDTO $reorderDTO, int $costPerItem, string $purchaseOrderNumber): ?Reorder
    {
        return Reorder::query()->create([
            "purchase_order_number" => $purchaseOrderNumber,
            "product_variant_id" => $reorderDTO->product_variant_id,
            "quantity" => $reorderDTO->quantity,
            "expected_at" => $reorderDTO->expected_at,
            "cost_per_item" => $costPerItem,
            "notes" => $reorderDTO->notes ?? null
        ]);
    }

    public function findManyByVariantId(int $variantId): Collection
    {
        return Reorder::query()
            ->where("product_variant_id", $variantId)
            ->orderByDesc('created_at')
            ->get();
    }

    public function markAsReceive(Reorder $reorder): void
    {
        $reorder->update([
            "received_at" => now(),
            "status" => OrderStatusEnum::RECEIVED->value
        ]);
    }

    public function markAsCancel(Reorder $reorder, string $cancellationReason): void
    {
        $reorder->update([
            "cancelled_at" => now(),
            "cancelled_by_id" => auth()->id(),
            "cancellation_reason" => $cancellationReason,
            "status" => OrderStatusEnum::CANCELLED->value,
        ]);
    }

    public function countReorderToday(): int
    {
        return Reorder::query()
            ->whereDate("created_at", now()->toDateString())
            ->count();
    }

    public function hasPendingReorder(int $variantId): bool
    {
        return Reorder::query()
            ->where("product_variant_id", $variantId)
            ->where("status", OrderStatusEnum::PENDING->value)
            ->exists();
    }

    public function markAsAccepted(Reorder $reorder, string $acceptance_notes): void
    {
        $reorder->update([
            "status" => OrderStatusEnum::ACCEPTED->value,
            "accepted_at" => now(),
            "acceptance_notes" => $acceptance_notes,
        ]);
    }

    public function markAsRejected(Reorder $reorder, string $rejection_reason): void
    {
        $reorder->update([
            "status" => OrderStatusEnum::REJECTED->value,
            "rejected_at" => now(),
            "rejection_reason" => $rejection_reason,
        ]);
    }

    public function getLastReorder(int $variantId): ?Reorder
    {
        return Reorder::query()
            ->where("product_variant_id", $variantId)
            ->latest("created_at")
            ->first();
    }

    public function findReceivedReorder(): Collection
    {
        return Reorder::query()
            ->where('status', OrderStatusEnum::RECEIVED->value)
            ->with(["product_variant.product.supplier"])
            ->get();
    }
}
