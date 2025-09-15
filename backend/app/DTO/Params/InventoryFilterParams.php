<?php

namespace App\DTO\Params;

use Spatie\LaravelData\Data;

class InventoryFilterParams extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public ?int $category = null,
        public ?int $product = null,
        public ?string $show_low_stock = null,
        public ?string $mode = null,
    )
    {
        //
    }
}
