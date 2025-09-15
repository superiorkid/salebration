<?php

namespace App\Repositories;

use App\DTO\Params\PurchaseOrderFilterParams;
use App\DTO\PurchaseOrderDTO;
use App\Enums\OrderStatusEnum;
use App\Interfaces\PurchaseOrderItemRepositoryInterface;
use App\Interfaces\PurchaseOrderRepositoryInterface;
use App\Models\PurchaseOrder;
use App\Services\DocumentNumberService;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class PurchaseOrderRepository implements PurchaseOrderRepositoryInterface
{
    protected PurchaseOrderItemRepositoryInterface $purchaseOrderItemRepositoryInterface;
    protected DocumentNumberService $documentNumberService;

    /**
     * Create a new class instance.
     */
    public function __construct(
        PurchaseOrderItemRepositoryInterface $purchaseOrderItemRepositoryInterface,
        DocumentNumberService $documentNumberService
    )
    {
        $this->purchaseOrderItemRepositoryInterface = $purchaseOrderItemRepositoryInterface;
        $this->documentNumberService = $documentNumberService;
    }

    public function findOneById(int $id): ?PurchaseOrder
    {
        return PurchaseOrder::query()
            ->orderByDesc('created_at')
            ->with(['purchaseOrderItems.productVariant.product', 'supplier'])
            ->find($id);
    }

    public function findOneByPoNumber(string $poNumber): ?PurchaseOrder
    {
        return PurchaseOrder::query()
            ->where('purchase_order_number', $poNumber)
            ->with(['purchaseOrderItems.productVariant.product', 'supplier'])
            ->first();
    }

    public function create(PurchaseOrderDTO $purchaseOrderDTO): ?PurchaseOrder
    {
        $purchaseOrder = PurchaseOrder::query()
            ->create([
                "supplier_id" => $purchaseOrderDTO->supplier_id,
                "purchase_order_number" => $this->documentNumberService->generatePurchaseOrderNumber(),
                "expected_at" => $purchaseOrderDTO->expected_at,
                "notes" => $purchaseOrderDTO->notes,
            ]);

        $this->purchaseOrderItemRepositoryInterface->create($purchaseOrder, $purchaseOrderDTO->items);

        return $purchaseOrder->load('purchaseOrderItems.productVariant.product', "supplier");
    }

    public function delete(PurchaseOrder $purchaseOrder): void
    {
        $purchaseOrder->delete();
    }

    public function findMany(): Collection
    {
        return PurchaseOrder::query()
            ->orderByDesc('created_at')
            ->with(["purchaseOrderItems.productVariant.product", "supplier"])
            ->get();
    }

    public function markAsAccepted(PurchaseOrder $purchaseOrder, string $acceptance_notes): void
    {
        $purchaseOrder->update([
            "status" => OrderStatusEnum::ACCEPTED->value,
            "accepted_at" => now(),
            "acceptance_notes" => $acceptance_notes,
        ]);
    }

    public function markAsRejected(PurchaseOrder $purchaseOrder, string $rejection_reason): void
    {
        $purchaseOrder->update([
            "status" => OrderStatusEnum::REJECTED->value,
            "rejected_at" => now(),
            "rejection_reason" => $rejection_reason,
        ]);
    }

    public function markAsCancelled(PurchaseOrder $purchaseOrder, string $cancellation_reason): void
    {
        $purchaseOrder->update([
            "cancelled_at" => now(),
            "cancelled_by_id" => auth()->id(),
            "cancellation_reason" => $cancellation_reason,
            "status" => OrderStatusEnum::CANCELLED->value,
        ]);
    }

    public function markAsReceive(PurchaseOrder $purchaseOrder): void
    {
        $purchaseOrder->update([
            "status" => OrderStatusEnum::RECEIVED->value,
            "received_at" => now(),
        ]);
    }

    public function markAsPartial(PurchaseOrder $purchaseOrder): void
    {
        $purchaseOrder->update([
            "status" => OrderStatusEnum::PARTIAL->value,
        ]);
    }

    public function hasPendingOrderForSupplier(int $supplierId): bool
    {
        return PurchaseOrder::query()
            ->where("supplier_id", $supplierId)
            ->where("status", OrderStatusEnum::PENDING->value)
            ->exists();
    }

    public function findReceivedReorder(?PurchaseOrderFilterParams $filters = null): Collection
    {
        $query =  PurchaseOrder::query()
            ->where("status", OrderStatusEnum::RECEIVED->value)
            ->with(["purchaseOrderItems.productVariant.product", "supplier"]);

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

        return $query->get();
    }
}
