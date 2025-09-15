<?php

namespace App\DTO\Emails;

use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class LowStockProductData extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string $name,

        #[Required, StringType]
        public string $sku,

        #[Required, Numeric]
        public int    $stock,

        #[Required, Numeric]
        public int    $threshold
    )
    {
        //
    }
}
