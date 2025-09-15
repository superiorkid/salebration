<?php

namespace App\DTO;

use App\Enums\StockHistoryTypeEnum;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class StockHistoryDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType]
        public int $product_variant_id,

        #[Required, Enum(StockHistoryTypeEnum::class)]
        public string $type,

        #[Required, IntegerType]
        public int $quantity_before,

        #[Required, IntegerType]
        public int $quantity_after,

        #[Required, IntegerType]
        public int $quantity_change,

        #[Required, StringType]
        public string $notes
    )
    {
        //
    }
}
