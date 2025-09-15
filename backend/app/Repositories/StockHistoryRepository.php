<?php

namespace App\Repositories;

use App\DTO\StockHistoryDTO;
use App\Interfaces\StockHistoryRepositoryInterface;
use App\Models\StockHistory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class StockHistoryRepository implements StockHistoryRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findMany(): Collection
    {
        return StockHistory::query()
            ->with(["reference", "productVariant.product", "performedBy"])
            ->orderByDesc('created_at')
            ->get();
    }

    public function findManyByProductVariantId(int $productVariantId): Collection
    {
        return StockHistory::query()
            ->where("product_variant_id", $productVariantId)
            ->with(["reference", "productVariant.product", "performedBy"])
            ->orderByDesc('created_at')
            ->get();
    }

    public function findOneById(int $id): ?StockHistory
    {
        return StockHistory::query()
            ->with(["reference", "productVariant.product", "performedBy"])
            ->find($id);
    }

    public function create(StockHistoryDTO $stockHistoryDTO, Model $model): StockHistory
    {
        $history = new StockHistory([
            "product_variant_id" => $stockHistoryDTO->product_variant_id,
            "performed_by_id" => auth()->id(),
            "type" => $stockHistoryDTO->type,
            "quantity_before" => $stockHistoryDTO->quantity_before,
            "quantity_after" => $stockHistoryDTO->quantity_after,
            "quantity_change" => $stockHistoryDTO->quantity_change,
            "notes" => $stockHistoryDTO->notes,
        ]);

        $history->reference()->associate($model);
        $history->save();
        return $history;
    }

    public function delete(StockHistory $stockHistory): void
    {
        $stockHistory->delete();
    }
}
