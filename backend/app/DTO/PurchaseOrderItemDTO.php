<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class PurchaseOrderItemDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType, Exists("product_variants", "id")]
        public int $product_variant_id,

        #[Required, IntegerType, Min(1)]
        public int $quantity,

        #[Required, IntegerType, Min(0)]
        public int $unit_price
    )
    {
        //
    }
}
