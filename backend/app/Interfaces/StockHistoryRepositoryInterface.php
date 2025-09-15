<?php

namespace App\Interfaces;

use App\DTO\StockHistoryDTO;
use App\Models\StockHistory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface StockHistoryRepositoryInterface
{
    public function findMany(): Collection;
    public function findManyByProductVariantId(int $productVariantId): Collection;
    public function findOneById(int $id): ?StockHistory;
    public function create(StockHistoryDTO $stockHistoryDTO, Model $model): StockHistory;
    public function delete(StockHistory $stockHistory): void;
}
