<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ValidateReorderTokenDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string $token,

        #[Required, IntegerType]
        public int $reorder_id,
    )
    {
        //
    }
}
