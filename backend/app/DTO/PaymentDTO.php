<?php

namespace App\DTO;

use App\Enums\PaymentMethodEnum;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class PaymentDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, Enum(PaymentMethodEnum::class)]
        public PaymentMethodEnum $method,

        #[Required, IntegerType, Min(0)]
        public int $amount,
    )
    {
        //
    }
}
