<?php

namespace App\DTO\Params;

use Spatie\LaravelData\Data;

class SaleFiltersParams extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?int $operator = null,
        public ?string $status = null,
        public ?string $payment_method = null,
        public ?string $mode = null,
        public ?bool $show_refunded = null,
    )
    {
        //
    }
}
