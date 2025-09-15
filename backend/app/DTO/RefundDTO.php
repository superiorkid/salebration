<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class RefundDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Nullable, StringType]
        public string $reason,
    )
    {
        //
    }
}
