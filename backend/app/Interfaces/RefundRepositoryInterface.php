<?php

namespace App\Interfaces;

use App\Models\Refund;

interface RefundRepositoryInterface
{
    public function create(int $saleId, ?string $reason): Refund;
}
