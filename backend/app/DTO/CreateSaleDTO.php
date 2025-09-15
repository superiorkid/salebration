<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Symfony\Contracts\Service\Attribute\Required;

class CreateSaleDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType, Min(1)]
        public int $total,

        #[Required, IntegerType, Min(0)]
        public int $paid,

        #[Required, IntegerType, Min(0)]
        public int $change,

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
