<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class ExpenseCategoryDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType, Unique("expense_categories", "name")]
        public string $name,
    )
    {
        //
    }
}
