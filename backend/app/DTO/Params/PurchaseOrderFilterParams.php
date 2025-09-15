<?php

namespace App\DTO\Params;

use Spatie\LaravelData\Data;

class PurchaseOrderFilterParams extends Data
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
