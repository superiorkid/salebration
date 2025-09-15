<?php

namespace App\Services;

use App\DTO\Params\ExpenseFiltersParams;
use App\DTO\Params\FinancialFilterParams;
use App\DTO\Params\InventoryFilterParams;
use App\DTO\Params\PurchaseOrderFilterParams;
use App\DTO\Params\SaleFiltersParams;
use App\Enums\FinancialPeriodParamsEnum;
use App\Enums\PaymentMethodEnum;
use App\Exports\FinancialReportExport;
use App\Exports\InventoryReportExport;
use App\Exports\SalesReportExport;
use App\Interfaces\CompanyRepositoryInterface;
use App\Interfaces\ExpenseRepositoryInterface;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Interfaces\PurchaseOrderRepositoryInterface;
use App\Interfaces\ReorderRepositoryInterface;
use App\Interfaces\SaleRepositoryInterface;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportService
{
    protected SaleRepositoryInterface $saleRepositoryInterface;
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;
    protected ReorderRepositoryInterface $reorderRepositoryInterface;
    protected PurchaseOrderRepositoryInterface $purchaseOrderRepositoryInterface;
    protected ExpenseRepositoryInterface $expenseRepositoryInterface;
    protected CompanyRepositoryInterface $companyRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        SaleRepositoryInterface $saleRepositoryInterface,
        ProductVariantRepositoryInterface $productVariantRepositoryInterface,
        ReorderRepositoryInterface $reorderRepositoryInterface,
        PurchaseOrderRepositoryInterface $purchaseOrderRepositoryInterface,
        ExpenseRepositoryInterface $expenseRepositoryInterface,
        CompanyRepositoryInterface $companyRepositoryInterface
    )
    {
        $this->saleRepositoryInterface = $saleRepositoryInterface;
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
        $this->reorderRepositoryInterface = $reorderRepositoryInterface;
        $this->purchaseOrderRepositoryInterface = $purchaseOrderRepositoryInterface;
        $this->expenseRepositoryInterface = $expenseRepositoryInterface;
        $this->companyRepositoryInterface = $companyRepositoryInterface;
    }

    public function salesReport(SaleFiltersParams $filters): JsonResponse
    {
        try {
            $saleFilters = new SaleFiltersParams(
                start_date: $filters->start_date,
                end_date: $filters->end_date,
                operator: $filters->operator,
                status: $filters->status,
                payment_method: $filters->payment_method,
                mode: $filters->mode,
                show_refunded: true
            );

            $sales = $this->saleRepositoryInterface->findMany($saleFilters);

            // summary cards
            $totalRevenue = $sales->sum('total');
            $totalOrders = $sales->count();
            $totalItems = $sales->flatMap->items->sum('quantity');
            $averageOrderValue = $totalOrders ? $totalRevenue / $totalOrders : 0;

            // line chart: grouped by day
            $chartData = $sales->groupBy(fn($sale) => $sale->created_at->format('Y-m-d'))
                ->map(fn($daySales) => [
                    'date' => $daySales->first()->created_at->format('Y-m-d'),
                    'total' => $daySales->sum('total'),
                    'average_order_value' => $daySales->count() > 0 ? $daySales->sum('total') / $daySales->count() : 0,
                    'cash_total' => $daySales->filter(fn($s) => $s->payments[0]->method === PaymentMethodEnum::CASH->value)->sum('total'),
                    'qris_total' => $daySales->filter(fn($s) => $s->payments[0]->method === PaymentMethodEnum::QRIS->value)->sum('total'),
                ])
                ->values();

            // table data
            $tableData = $sales->map(fn($sale) => [
                'id' => $sale->id,
                'date' => $sale->created_at->toISOString(),
                'total_amount' => $sale->total,
                'items_sold' => $sale->items->sum('quantity'),
                'payment_method' => $sale->payments[0]->method ?? "-",
                'status' => $sale->status,
                'operator' => $sale->operator->name ?? "-",
                'customer' => $sale->customer->name ?? "-",
            ]);

            return response()->json([
                "success" => true,
                "message" => "Sales report data fetched.",
                "data" => [
                    "summary" => [
                        "total_revenue" => $totalRevenue,
                        "total_orders" => $totalOrders,
                        "total_items" => $totalItems,
                        "average_order_value" => $averageOrderValue,
                    ],
                    "chart" => $chartData,
                    "table" => $tableData,
                ]
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function inventoryReport(InventoryFilterParams $filters): JsonResponse
    {
        try {
            $allVariants = $this->productVariantRepositoryInterface->findMany();
            // summary
            $totalQuantity = $allVariants->sum('quantity');
            $totalValue = $allVariants->sum(function ($variant) {
                return ($variant->product->base_price + $variant->additional_price) * $variant->quantity;
            });
            $skuCount = $allVariants->count();
            $lowStockCount = $this->productVariantRepositoryInterface->findManyLowStockVariant()->count();


            $variants = $this->productVariantRepositoryInterface->findManyWithFilters($filters);
            // table data
            $tableData = $variants->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'product' => $variant->product->name ?? "-",
                    'sku' => "{$variant->product->sku}{$variant->sku_suffix}",
                    'category' => $variant->product->category->name ?? "-",
                    'supplier' => $variant->product->supplier->name ?? "-",
                    'quantity' => $variant->quantity,
                    'cost' => $variant->product->base_price + $variant->additional_price,
                    'value' => ($variant->product->base_price + $variant->additional_price) * $variant->quantity,
                    'updated_at' => $variant->updated_at->toISOString(),
                ];
            });

            return response()->json([
                "success" => true,
                "message" => "Inventory report data fetched.",
                "data" => [
                    "summary" => [
                        'total_quantity' => $totalQuantity,
                        'total_value' => $totalValue,
                        'sku_count' => $skuCount,
                        'low_stock_count' => $lowStockCount,
                    ],
                    "table" => $tableData,
                ]
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function financialReport(FinancialFilterParams $filters): JsonResponse
    {
        $period = FinancialPeriodParamsEnum::tryFrom(
            $filters->period ?? FinancialPeriodParamsEnum::MONTHLY->value
        );
        $dateRange = $this->saleRepositoryInterface->getDateRangeFromPeriod(
            $period,
        $filters->start_date ? Carbon::parse($filters->start_date) : null,
            $filters->end_date ? Carbon::parse($filters->end_date) : null,
        );

        $saleFilters = new SaleFiltersParams(
            start_date: $dateRange["start_date"]?->toDateTimeString(),
            end_date: $dateRange["end_date"]?->toDateTimeString(),
            show_refunded: false
        );

        $purchaseFilters = new PurchaseOrderFilterParams(
            start_date: $dateRange["start_date"]?->toDateTimeString(),
            end_date: $dateRange["end_date"]?->toDateTimeString()
        );

        $expenseFilters = new ExpenseFiltersParams(
            start_date: $dateRange["start_date"]?->toDateTimeString(),
            end_date: $dateRange["end_date"]?->toDateTimeString()
        );

        try {
            $sales = $this->saleRepositoryInterface->findMany($saleFilters);
            $revenue = $sales->sum('total');

            $purchaseOrders = $this->purchaseOrderRepositoryInterface->findReceivedReorder($purchaseFilters);
            $purchaseOrdersCogs = $purchaseOrders->flatMap->purchaseOrderItems->sum(function ($item) {
                return $item->unit_price * $item->received_quantity;
            });

            $reorders = $this->reorderRepositoryInterface->findMany();
            $reorderCost = $reorders->sum(function ($reorder) {
                return $reorder->cost_per_item * $reorder->quantity;
            });

            $totalCogs = $purchaseOrdersCogs + $reorderCost;

            $expenses = $this->expenseRepositoryInterface->findMany($expenseFilters);
            $totalExpenses = $expenses->sum("amount");

            $grossProfit = $revenue - $totalCogs;
            $netProfit = $grossProfit - $totalExpenses;

            $chartData = $sales->groupBy(fn($sale) => $sale->created_at->format('Y-m'))->map(
                function ($monthlySales, $month) use ($purchaseOrders, $reorders) {
                    $monthlyRevenue = $monthlySales->sum('total');

                    $monthlyPurchaseCOGS = $purchaseOrders
                        ->filter(fn($po) => $po->created_at->format('Y-m') === $month)
                        ->flatMap->purchaseOrderItems->sum(fn($item) => $item->unit_price * $item->received_quantity);

                    $monthlyReorderCOGS = $reorders
                        ->filter(fn($r) => $r->created_at->format('Y-m') === $month)
                        ->sum(fn($r) => $r->cost_per_item * $r->quantity);

                    return [
                        'month' => $month,
                        'revenue' => $monthlyRevenue,
                        'cogs' => $monthlyPurchaseCOGS + $monthlyReorderCOGS,
                        'net_profit' => $monthlyRevenue - ($monthlyPurchaseCOGS + $monthlyReorderCOGS),
                    ];
                })->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'summary' => [
                        'total_revenue' => $revenue,
                        'total_cogs' => $totalCogs,
                        'gross_profit' => $grossProfit,
                        'net_profit' => $netProfit,
                    ],
                    'chart' => $chartData,
                ]
            ]);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function salesReportExport(SaleFiltersParams $filters): BinaryFileResponse
    {
        $fileNameFormat = 'sales-export-' . now()->format('Y-m-d-H-i-s');

        if ($filters->mode === 'csv') {
            return Excel::download(
                new SalesReportExport(
                    $this->saleRepositoryInterface,
                    $this->companyRepositoryInterface,
                    $filters
                ),
                "{$fileNameFormat}.csv",
                \Maatwebsite\Excel\Excel::CSV,
                [
                    "Content-Type" => "text/csv",
                ]
            );
        }

        return Excel::download(
            new SalesReportExport(
                $this->saleRepositoryInterface,
                $this->companyRepositoryInterface,
                $filters
            ),
            "{$fileNameFormat}.xlsx",
            \Maatwebsite\Excel\Excel::XLSX
        );
    }

    public function inventoryReportExport(InventoryFilterParams $filters): BinaryFileResponse
    {
        $fileNameFormat = 'inventory-export-' . now()->format('Y-m-d-H-i-s');

        if ($filters->mode === 'csv') {
            return Excel::download(
                new InventoryReportExport(
                    $this->productVariantRepositoryInterface,
                    $this->companyRepositoryInterface,
                    $filters
                ),
                "{$fileNameFormat}.csv",
                \Maatwebsite\Excel\Excel::CSV,
                [
                    "Content-Type" => "text/csv",
                ]
            );
        }

        return Excel::download(
            new InventoryReportExport(
                $this->productVariantRepositoryInterface,
                $this->companyRepositoryInterface,
                $filters
            ),
            "{$fileNameFormat}.xlsx",
            \Maatwebsite\Excel\Excel::XLSX
        );
    }

    public function financialReportExport(FinancialFilterParams $filters): BinaryFileResponse
    {
        $fileNameFormat = 'financial-export-' . now()->format('Y-m-d-H-i-s');

        if ($filters->mode === 'csv') {
            return Excel::download(
                new FinancialReportExport(
                    $this->saleRepositoryInterface,
                    $this->purchaseOrderRepositoryInterface,
                    $this->reorderRepositoryInterface,
                    $this->expenseRepositoryInterface,
                    $this->companyRepositoryInterface,
                    $filters
                ),
                "{$fileNameFormat}.csv",
                \Maatwebsite\Excel\Excel::CSV,
                [
                    "Content-Type" => "text/csv",
                ]
            );
        }

        return Excel::download(
            new FinancialReportExport(
                $this->saleRepositoryInterface,
                $this->purchaseOrderRepositoryInterface,
                $this->reorderRepositoryInterface,
                $this->expenseRepositoryInterface,
                $this->companyRepositoryInterface,
                $filters
            ),
            "{$fileNameFormat}.xlsx",
            \Maatwebsite\Excel\Excel::XLSX
        );
    }

}
