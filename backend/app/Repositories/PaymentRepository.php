<?php

namespace App\Repositories;

use App\DTO\PaymentDTO;
use App\Interfaces\PaymentRepositoryInterface;
use App\Models\Payment;
use Illuminate\Support\Collection;

class PaymentRepository implements PaymentRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


    public function getTotalRevenueToday(): int
    {
        return  Payment::query()
            ->whereDate('paid_at', today())
            ->sum('amount');
    }

    public function getTodayRevenueByPaymentMethod(): Collection
    {
        return Payment::query()->whereDate("paid_at", today())
            ->selectRaw('method, SUM(amount) as total')
            ->groupBy('method')
            ->pluck('total', 'method');
    }

    public function create(PaymentDTO $paymentDTO, int $saleId): void
    {
        Payment::query()->create([
            "method" => $paymentDTO->method,
            "amount" => $paymentDTO->amount,
            "paid_at" => now(),
            "sale_id" => $saleId
        ]);
    }
}
