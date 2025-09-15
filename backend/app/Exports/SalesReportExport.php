<?php

namespace App\Exports;

use App\DTO\Params\SaleFiltersParams;
use App\Interfaces\CompanyRepositoryInterface;
use App\Interfaces\SaleRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Concerns\{FromCollection,
    ShouldAutoSize,
    WithCustomStartCell,
    WithEvents,
    WithHeadings,
    WithMapping,
    WithStyles};
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SalesReportExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithCustomStartCell,
    ShouldAutoSize,
    WithEvents
{
    public function __construct(
        protected SaleRepositoryInterface $saleRepository,
        protected CompanyRepositoryInterface $companyRepository,
        protected ?SaleFiltersParams $filters = null
    ) {}

    public function collection(): Collection
    {
        return $this->saleRepository->findMany($this->filters);
    }

    public function headings(): array
    {
        $company = $this->companyRepository->getCompany();

        return [
            ["{$company->display_name}"],
            ["{$company->address}"],
            ["Phone: {$company->phone} | Email: {$company->email}"],
            [],
            ['SALES REPORT'],
            ['Period: ' . $this->getFormattedDateRange()],
            ['Report Generated: ' . now()->format('M d, Y')],
            [],
            [
                'Transaction Date',
                'Invoice Number',
                'Total Amount',
                'Items Count',
                'Payment Method',
                'Status',
                'Processed By',
                'Customer'
            ]
        ];
    }

    public function map($row): array
    {
        return [
            $row->created_at->format('Y-m-d H:i'),
            $row->invoice->number,
            $row->total,
            $row->items->count(),
            $row->payments->first()?->method ?? 'N/A',
            ucfirst($row->status),
            $row->operator?->name ?? 'System',
            $row->customer?->name ?? 'Guest'
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
                $highestRow = $sheet->getDelegate()->getHighestRow();

                $sheet->mergeCells('A1:H1');
                $sheet->mergeCells('A2:H2');
                $sheet->mergeCells('A3:H3');
                $sheet->mergeCells('A5:H5');
                $sheet->mergeCells('A6:H6');
                $sheet->mergeCells('A7:H7');

                $totalAmount = 0;
                $totalItems = 0;
                $transactions = $this->collection();

                foreach ($transactions as $transaction) {
                    $totalAmount += $transaction->total;
                    $totalItems += $transaction->items->count();
                }

                $totalsRow = $highestRow + 2;
                $sheet->setCellValue('A'.$totalsRow, 'TOTAL:');
                $sheet->getStyle('A'.$totalsRow)->getFont()->setBold(true);

                $sheet->setCellValue('C'.$totalsRow, $totalAmount);
                $sheet->setCellValue('D'.$totalsRow, $totalItems);

                $sheet->getStyle('A'.$totalsRow.':H'.$totalsRow)->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'E6E6E6']
                    ],
                    'borders' => [
                        'top' => ['borderStyle' => Border::BORDER_THIN],
                        'bottom' => ['borderStyle' => Border::BORDER_THIN]
                    ]
                ]);

                $sheet->getStyle('C'.$totalsRow)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

                for ($row = 10; $row <= $highestRow; $row++) {
                    if ($row % 2 === 0) {
                        $sheet->getStyle("A{$row}:H{$row}")
                            ->getFill()
                            ->setFillType(Fill::FILL_SOLID)
                            ->getStartColor()
                            ->setRGB('F2F2F2');
                    }
                }

                $sheet->getStyle('C10:C'.$highestRow)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

                $sheet->getStyle('A9:H'.$highestRow)
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_THIN);
            },
        ];
    }

    protected function getFormattedDateRange(): string
    {
        if (!$this->filters) return 'All Time';

        $start = $this->filters->start_date;
        $end = $this->filters->end_date;

        $startDate = $start ? Carbon::parse($start) : null;
        $endDate = $end ? Carbon::parse($end) : null;

        if ($startDate && $endDate) {
            return $startDate->format('M d, Y') . ' - ' . $endDate->format('M d, Y');
        }
        if ($startDate) {
            return 'From ' . $startDate->format('M d, Y');
        }
        if ($endDate) {
            return 'Until ' . $endDate->format('M d, Y');
        }

        return 'All Time';
    }
}
