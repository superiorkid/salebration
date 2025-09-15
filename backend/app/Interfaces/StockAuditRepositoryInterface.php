<?php

namespace App\Interfaces;

use App\DTO\StockAuditDTO;
use App\Models\StockAudit;
use Illuminate\Database\Eloquent\Collection;

interface StockAuditRepositoryInterface
{
    public function findMany(): Collection;
    public function findManyByProductVariantId(int $productVariantId): Collection;
    public function findOneById(int $id): ?StockAudit;
    public function create(StockAuditDTO $auditStockDTO, int $systemQuantity): ?StockAudit;
    public function delete(StockAudit $stockAudit): void;
}
