<?php

namespace App\Interfaces;

use App\DTO\PaymentDTO;
use Illuminate\Support\Collection;

interface PaymentRepositoryInterface
{
    public function getTotalRevenueToday(): int;
    public function getTodayRevenueByPaymentMethod(): Collection;
    public function create(PaymentDTO $paymentDTO, int $saleId): void;
}
