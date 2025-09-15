<?php

namespace App\DTO\Params;

use Spatie\LaravelData\Data;

class FinancialFilterParams extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public ?string $period = null,
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?string $mode = null,
    )
    {
        //
    }
}
