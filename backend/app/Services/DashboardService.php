<?php

namespace App\Services;

use App\Enums\SaleStatusEnum;
use App\Models\Sale;
use App\Models\SaleItem;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    protected Carbon $today;
    protected Carbon $yesterday;
    protected Carbon $weekStart;
    protected Carbon $weekEnd;

    public function __construct()
    {
        $this->today = \Carbon\Carbon::now('Asia/Makassar');
        $this->yesterday = $this->today->copy()->subDay();
        $this->weekStart = $this->today->copy()->subDays(6)->startOfDay();
        $this->weekEnd = $this->today->copy()->endOfDay();
    }

    protected function applyTimezoneConversion(string $column): string
    {
        return "($column AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Makassar')::date";
    }

    public function dashboardMetrics(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $this->getDashboardData()
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    protected function getDashboardData(): array
    {
        return [
            'summary' => $this->getTodaySummary(),
            'sales_by_payment_method' => $this->getSalesByPaymentMethod(),
            'top_products' => $this->getTopSellingProducts(),
            'weekly_sales' => $this->getWeeklySales(),
        ];
    }

    protected function getTodaySummary(): array
    {
        $todaySales = $this->getTodaySalesWithItems();
        $yesterdaySales = $this->getYesterdaySalesWithItems();

        [$todayRevenue, $todayCogs] = $this->calculateSalesTotals($todaySales);
        [$yesterdayRevenue, $yesterdayCogs] = $this->calculateSalesTotals($yesterdaySales);

        $todayRefundCount = $this->getTodayRefundCount();
        $yesterdayRefundCount = $this->getYesterdayRefundCount();

        return [
            'total_revenue' => [
                'value' => $todayRevenue,
                'comparison' => $this->calculateComparison($todayRevenue, $yesterdayRevenue),
            ],
            'total_sales' => [
                'value' => $todaySales->count(),
                'comparison' => $this->calculateComparison($todaySales->count(), $yesterdaySales->count()),
            ],
            'refund_count' => [
                'value' => $todayRefundCount,
                'comparison' => $this->calculateComparison($todayRefundCount, $yesterdayRefundCount),
            ],
            'gross_profit' => [
                'value' => $todayRevenue - $todayCogs,
                'comparison' => $this->calculateComparison(
                    $todayRevenue - $todayCogs,
                    $yesterdayRevenue - $yesterdayCogs
                ),
            ],
        ];
    }

    protected function getYesterdaySalesWithItems(): \Illuminate\Database\Eloquent\Collection
    {
        return Sale::query()
            ->with(['items.productVariant.product'])
            ->where("status", SaleStatusEnum::PAID->value)
            ->whereRaw($this->applyTimezoneConversion('created_at')." = ?",
                [$this->yesterday->format('Y-m-d')])
            ->get();
    }

    protected function getYesterdayRefundCount(): int
    {
        return Sale::query()
            ->whereDate('created_at', today()->subDay())
            ->where('status', '!=', SaleStatusEnum::REFUNDED->value)
            ->count();
    }

    protected function calculateComparison(float $currentValue, float $previousValue): array
    {
        if ($previousValue == 0) {
            // Handle division by zero case
            return [
                'percentage' => $currentValue > 0 ? 100 : 0,
                'trend' => $currentValue > 0 ? 'increase' : ($currentValue < 0 ? 'decrease' : 'neutral'),
                'value' => $currentValue,
            ];
        }

        $percentage = (($currentValue - $previousValue) / $previousValue) * 100;
        $trend = $percentage > 0 ? 'increase' : ($percentage < 0 ? 'decrease' : 'neutral');

        return [
            'percentage' => round(abs($percentage), 2),
            'trend' => $trend,
            'value' => $currentValue - $previousValue,
        ];
    }

    protected function getTodaySalesWithItems(): \Illuminate\Database\Eloquent\Collection
    {
        return Sale::query()
            ->with(['items.productVariant.product'])
            ->where("status", SaleStatusEnum::PAID->value)
            ->whereRaw($this->applyTimezoneConversion('created_at')." = ?",
                [$this->today->format('Y-m-d')])
            ->get();
    }

    protected function calculateSalesTotals($sales): array
    {
        $totalRevenue = 0;
        $totalCogs = 0;

        foreach ($sales as $sale) {
            foreach ($sale->items as $item) {
                $quantity = $item->quantity;
                $totalRevenue += $item->subtotal;
                $totalCogs += $quantity * $this->getItemCost($item);
            }
        }

        return [$totalRevenue, $totalCogs];
    }

    protected function getItemCost(SaleItem $item): float
    {
        $product = $item->productVariant->product ?? null;
        $basePrice = $product->base_price ?? 0;
        $additionalPrice = $item->productVariant->additional_price ?? 0;

        return $basePrice + $additionalPrice;
    }

    protected function getTodayRefundCount(): int
    {
        return Sale::query()
            ->whereRaw($this->applyTimezoneConversion('created_at')." = ?",
                [$this->today->format('Y-m-d')])
            ->where('status', SaleStatusEnum::REFUNDED->value)
            ->count();
    }

    protected function getSalesByPaymentMethod(): array
    {
        $todaySales = $this->getTodaySalesWithPayments();
        $paymentTotals = $this->calculatePaymentMethodTotals($todaySales);

        return $this->formatPaymentMethodResults($paymentTotals);
    }

    protected function getTodaySalesWithPayments(): \Illuminate\Database\Eloquent\Collection
    {
        return Sale::with(['items', 'payments'])
            ->where("status", SaleStatusEnum::PAID->value)
            ->whereRaw($this->applyTimezoneConversion('created_at')." = ?",
                [$this->today->format('Y-m-d')])
            ->get();
    }

    protected function calculatePaymentMethodTotals($sales): array
    {
        $result = [];

        foreach ($sales as $sale) {
            $saleTotal = $sale->items->sum("subtotal");
            $paymentCount = max($sale->payments->count(), 1); // avoid division by 0
            $partialAmount = $saleTotal / $paymentCount;

            foreach ($sale->payments as $payment) {
                $method = $payment->method;
                $result[$method] = ($result[$method] ?? 0) + $partialAmount;
            }
        }

        return $result;
    }

    protected function formatPaymentMethodResults(array $paymentTotals): array
    {
        $allMethods = ['cash', 'qris', 'card'];
        $results = [];

        foreach ($allMethods as $method) {
            $results[] = [
                'method' => $method,
                'total' => round($paymentTotals[$method] ?? 0),
            ];
        }

        return $results;
    }

    protected function getTopSellingProducts(): array
    {
        return SaleItem::query()
            ->select('product_variant_id', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('sale', fn ($query) => $query
                ->where('status', '!=', SaleStatusEnum::REFUNDED->value)
                ->whereRaw("(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Makassar')::date = ?",
                    [$this->today->format('Y-m-d')])
            )
            ->groupBy('product_variant_id')
            ->with('productVariant.product')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'name' => "{$item->productVariant->product->name} {$item->productVariant->value}",
                'sold' => $item->total_sold,
            ])
            ->toArray();
    }

    protected function getWeeklySales(): array
    {
        $salesData = Sale::query()
            ->select(
                DB::raw($this->applyTimezoneConversion('created_at')." as date"),
                DB::raw('SUM(total) as total')
            )
            ->where('status', '!=', SaleStatusEnum::REFUNDED->value)
            ->whereBetween(DB::raw($this->applyTimezoneConversion('created_at')), [
                $this->weekStart->format('Y-m-d'),
                $this->weekEnd->format('Y-m-d')
            ])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dates = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = $this->today->copy()->subDays($i)->format('Y-m-d');
            $dates->put($date, [
                'date' => $date,
                'total' => $salesData->has($date) ? (int) $salesData[$date]->total : 0
            ]);
        }

        return $dates->values()->toArray();
    }

}
