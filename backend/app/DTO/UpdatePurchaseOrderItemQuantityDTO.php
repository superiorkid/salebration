<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class UpdatePurchaseOrderItemQuantityDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType, Min(0)]
        public int $received_quantity
    )
    {
        //
    }
}
