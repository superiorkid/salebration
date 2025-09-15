<?php

namespace App\Repositories;

use App\Interfaces\SaleItemRepositoryInterface;
use App\Models\SaleItem;
use Spatie\LaravelData\DataCollection;

class SaleItemRepository implements SaleItemRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getTotalItemsSoldToday(): int
    {
         return SaleItem::query()->whereHas("sale", function ($query){
            $query->whereDate("created_at", today());
        })->sum("quantity");
    }

    public function createItemsForSale(DataCollection $saleItems, int $saleId): void
    {
        $itemsToCreate = $saleItems->toCollection()->map(function ($item) use ($saleId) {
                return [
                    "sale_id" => $saleId,
                    "product_variant_id" => $item->productVariantId,
                    "quantity" => $item->quantity,
                    "price" => $item->price,
                    "subtotal" => $item->subtotal,
                    "created_at" => now(),
                    "updated_at" => now(),
                ];
        });

        SaleItem::query()->insert($itemsToCreate->toArray());
    }
}
