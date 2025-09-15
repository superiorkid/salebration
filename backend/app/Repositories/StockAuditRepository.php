<?php

namespace App\Repositories;

use App\DTO\StockAuditDTO;
use App\Interfaces\StockAuditRepositoryInterface;
use App\Models\StockAudit;
use Illuminate\Database\Eloquent\Collection;

class StockAuditRepository implements StockAuditRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findOneById(int $id): ?StockAudit
    {
        return StockAudit::query()
            ->with(["productVariant.product", "auditor"])
            ->find($id);
    }

    public function findMany(): Collection
    {
        return StockAudit::query()
            ->with(["productVariant.product", "auditor"])
            ->orderByDesc("created_at")
            ->get();
    }

    public function findManyByProductVariantId(int $productVariantId): Collection
    {
        return StockAudit::query()
            ->where("product_variant_id", $productVariantId)
            ->with(["productVariant.product", "auditor"])
            ->orderbyDesc("created_at")
            ->get();
    }

    public function create(StockAuditDTO $auditStockDTO, int $systemQuantity): ?StockAudit
    {
        return StockAudit::query()
            ->create([
                "product_variant_id" => $auditStockDTO->product_variant_id,
                "audited_by_id" => auth()->id(),
                "system_quantity" => $systemQuantity,
                "counted_quantity" => $auditStockDTO->counted_quantity,
                "difference" => $auditStockDTO->counted_quantity - $systemQuantity,
                "notes" => $auditStockDTO->notes,
            ]);
    }

    public function delete(StockAudit $stockAudit): void
    {
        $stockAudit->delete();
    }
}
