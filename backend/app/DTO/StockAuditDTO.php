<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class StockAuditDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType, Exists("product_variants", "id")]
        public int $product_variant_id,

        #[Required, IntegerType]
        public int $counted_quantity,

        #[Required, StringType]
        public string $notes
    )
    {
        //
    }
}
