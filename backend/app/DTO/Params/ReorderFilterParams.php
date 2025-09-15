<?php

namespace App\DTO\Params;

use Spatie\LaravelData\Data;

class ReorderFilterParams extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public ?string $start_date = null,
        public ?string $end_date = null,
    )
    {
        //
    }
}
