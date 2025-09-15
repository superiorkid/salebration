<?php

namespace App\Interfaces;

use App\Models\Sale;
use Illuminate\Support\Collection;
use Spatie\LaravelData\DataCollection;

interface SaleItemRepositoryInterface
{
    public function getTotalItemsSoldToday(): int;
    public function createItemsForSale(DataCollection $saleItems, int $saleId): void;
}
