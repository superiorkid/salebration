<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class RoleDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string $name,

        #[ArrayType]
        public mixed $permissions,
    )
    {
        //
    }
}
