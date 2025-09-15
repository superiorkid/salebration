<?php

namespace App\Repositories;

use App\Interfaces\RefundRepositoryInterface;
use App\Models\Refund;

class RefundRepository implements RefundRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create(int $saleId, ?string $reason): Refund
    {
        return Refund::query()->create([
            "sale_id" => $saleId,
            "reason" => $reason,
            "refunded_by" => auth()->id(),
            "refunded_at" => now()
        ]);
    }
}
