<?php

namespace App\DTO;

use App\Enums\OrderValidationTypeEnum;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ValidateOrderTokenDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string $token,

        #[Required, IntegerType]
        public int $order_id,

        #[Required, Enum(OrderValidationTypeEnum::class)]
        public string $type,
    )
    {
        //
    }
}
