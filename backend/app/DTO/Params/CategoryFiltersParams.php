<?php

namespace App\DTO\Params;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;

class CategoryFiltersParams extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[BooleanType]
        public bool $parent_only = false,
    )
    {
        //
    }
}
