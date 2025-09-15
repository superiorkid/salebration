<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class XenditDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType]
        public int $total,

        #[Required, DataCollectionOf(SaleItemDTO::class), Min(1)]
        public DataCollection $items,

        #[Required]
        public PaymentDTO $payment,

        #[Nullable]
        public ?CustomerDTO $customer,
    )
    {
        //
    }
}
