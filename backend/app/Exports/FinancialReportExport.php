<?php

namespace App\Exports;

use App\DTO\Params\ExpenseFiltersParams;
use App\DTO\Params\FinancialFilterParams;
use App\DTO\Params\PurchaseOrderFilterParams;
use App\DTO\Params\ReorderFilterParams;
use App\DTO\Params\SaleFiltersParams;
use App\Enums\FinancialPeriodParamsEnum;
use App\Interfaces\CompanyRepositoryInterface;
use App\Interfaces\ExpenseRepositoryInterface;
use App\Interfaces\PurchaseOrderRepositoryInterface;
use App\Interfaces\ReorderRepositoryInterface;
use App\Interfaces\SaleRepositoryInterface;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FinancialReportExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithCustomStartCell,
    ShouldAutoSize,
    WithEvents
{
    protected SaleRepositoryInterface $saleRepository;
    protected PurchaseOrderRepositoryInterface $purchaseOrderRepository;
    protected ReorderRepositoryInterface $reorderRepository;
    protected ExpenseRepositoryInterface $expenseRepository;
    protected CompanyRepositoryInterface $companyRepository;
    protected ?FinancialFilterParams $filters = null;

    public function __construct(
        SaleRepositoryInterface $saleRepository,
        PurchaseOrderRepositoryInterface $purchaseOrderRepository,
        ReorderRepositoryInterface $reorderRepository,
        ExpenseRepositoryInterface $expenseRepository,
        CompanyRepositoryInterface $companyRepository,
        FinancialFilterParams $filters
    ) {
        $this->saleRepository = $saleRepository;
        $this->purchaseOrderRepository = $purchaseOrderRepository;
        $this->reorderRepository = $reorderRepository;
        $this->expenseRepository = $expenseRepository;
        $this->companyRepository = $companyRepository;
        $this->filters = $filters;
    }

    public function collection(): \Illuminate\Support\Collection
    {
        $period = FinancialPeriodParamsEnum::tryFrom($this->filters->period)
            ?? FinancialPeriodParamsEnum::MONTHLY;

        $dateRange = $this->saleRepository->getDateRangeFromPeriod(
            $period,
            $this->filters->start_date ? Carbon::parse($this->filters->start_date) : null,
            $this->filters->end_date ? Carbon::parse($this->filters->end_date) : null
        );

        $salesFilters = new SaleFiltersParams(
            start_date: $dateRange["start_date"]?->toDateTimeString(),
            end_date: $dateRange["end_date"]?->toDateTimeString()
        );

        $poFilters = new PurchaseOrderFilterParams(
            start_date: $dateRange["start_date"]?->toDateTimeString(),
            end_date: $dateRange["end_date"]?->toDateTimeString()
        );

        $reorderFilters = new ReorderFilterParams(
            start_date: $dateRange["start_date"]?->toDateTimeString(),
            end_date: $dateRange["end_date"]?->toDateTimeString()
        );

        $expenseFilters = new ExpenseFiltersParams(
            start_date: $dateRange["start_date"]?->toDateTimeString(),
            end_date: $dateRange["end_date"]?->toDateTimeString()
        );

        $sales = $this->saleRepository->findMany($salesFilters);
        $purchaseOrders = $this->purchaseOrderRepository->findReceivedReorder($poFilters);
        $reorders = $this->reorderRepository->findMany($reorderFilters);
        $expenses = $this->expenseRepository->findMany($expenseFilters);

        // calculate financial metrics
        $revenue = $sales->sum("total");
        $cogs = $this->calculateTotalCogs($purchaseOrders, $reorders);
        $grossProfit = $revenue - $cogs;
        $totalExpenses = $expenses->sum("amount");
        $netProfit = $grossProfit - $totalExpenses;

        return collect([
            [
                'period' => $this->getPeriodLabel(),
                'revenue' => $revenue,
                'cogs' => $cogs,
                'gross_profit' => $grossProfit,
                'net_profit' => $netProfit,
            ]
        ]);
    }

    public function headings(): array
    {
        $company = $this->companyRepository->getCompany();

        return [
            ["{$company->display_name}"],
            ["{$company->address}"],
            ["Phone: {$company->phone} | Email: {$company->email}"],
            [],
            ['FINANCIAL REPORT'],
            ['Report Generated: ' . now()->setTimezone('Asia/Makassar')->format('M d, Y')],
            ['Period: ' . $this->getPeriodLabel()],
            [],
            [
                'Period',
                'Revenue',
                'COGS',
                'Gross Profit',
                'Net Profit'
            ]
        ];
    }

    public function map($row): array
    {
        return [
            $row['period'],
            format_idr($row['revenue']),
            format_idr($row['cogs']),
            format_idr($row['gross_profit']),
            format_idr($row['net_profit']),
        ];
    }

    public function startCell(): string
    {
        return 'A1';
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 16], 'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]],
            2 => ['alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]],
            3 => ['alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]],
            5 => ['font' => ['bold' => true, 'size' => 14], 'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]],
            6 => ['font' => ['italic' => true], 'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]],
            7 => ['alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]],
            8 => ['alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]],
            9 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2F75B5']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;

                foreach (range(1, 8) as $row) {
                    if ($row !== 4 && $row !== 9) {
                        $sheet->mergeCells("A{$row}:E{$row}");
                    }
                }

                $sheet->getStyle('B10:E10')
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

                $sheet->getStyle('A9:E10')
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_THIN);

                // Remove any conditional formatting for colors
                $sheet->setConditionalStyles('D10:E100', []);

                $sheet->getStyle('B10:E10')
                    ->getFont()
                    ->getColor()
                    ->setARGB('000000'); // Black

                $sheet->getStyle('B10:E10')
                    ->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'color' => ['rgb' => 'FFFFFF'] // White background
                        ]
                    ]);
            },
        ];
    }

    protected function getPeriodLabel(): string
    {
        if (!$this->filters) return 'All Time';

        $period = FinancialPeriodParamsEnum::tryFrom($this->filters->period) ?? FinancialPeriodParamsEnum::MONTHLY;

        return match ($period) {
            FinancialPeriodParamsEnum::MONTHLY => 'Monthly: ' . now()->format('M Y'),
            FinancialPeriodParamsEnum::QUARTERLY => 'Quarterly: Q' . ceil(now()->month / 3) . ' ' . now()->year,
            FinancialPeriodParamsEnum::YEARLY => 'Yearly: ' . now()->year,
            FinancialPeriodParamsEnum::CUSTOM => 'Custom: ' .
                Carbon::parse($this->filters->start_date)->format('M d, Y') . ' - ' .
                Carbon::parse($this->filters->end_date)->format('M d, Y'),
            default => 'All Time',
        };
    }

    protected function calculateTotalCogs($purchaseOrders, $reorders): float
    {
        $purchaseOrdersCogs = $purchaseOrders->flatMap->purchaseOrderItems->sum(function ($item) {
            return $item->unit_price * $item->received_quantity;
        });

        $reorderCost = $reorders->sum(function ($reorder) {
            return $reorder->cost_per_item * $reorder->quantity;
        });

        return $purchaseOrdersCogs + $reorderCost;
    }
}
