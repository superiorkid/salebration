<?php

namespace App\Exports;

use App\DTO\Params\InventoryFilterParams;
use App\Interfaces\CompanyRepositoryInterface;
use App\Interfaces\ProductVariantRepositoryInterface;
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

class InventoryReportExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithCustomStartCell,
    ShouldAutoSize,
    WithEvents
{
    protected ProductVariantRepositoryInterface $variantRepository;
    protected CompanyRepositoryInterface $companyRepository;
    protected ?InventoryFilterParams $filters = null;

    public function __construct(
        ProductVariantRepositoryInterface $variantRepository,
        CompanyRepositoryInterface $companyRepository,
        InventoryFilterParams $filters
    ) {
        $this->variantRepository = $variantRepository;
        $this->companyRepository = $companyRepository;
        $this->filters = $filters;
    }

    public function collection(): \Illuminate\Support\Collection
    {
        return $this->variantRepository->findManyWithFilters($this->filters);
    }

    public function headings(): array
    {
        $company = $this->companyRepository->getCompany();

        return [
            ["{$company->display_name}"],
            ["{$company->address}"],
            ["Phone: {$company->phone} | Email: {$company->email}"],
            [],
            ['INVENTORY REPORT'],
            ['Report Generated: ' . now()->setTimezone('Asia/Makassar')->format('M d, Y')],
            ['Stock Status: ' . $this->getStockStatusFilter()],
            [],
            [
                'Product Name',
                'SKU',
                'Category',
                'Current Stock',
                'Min Stock Level',
                'Stock Status',
                'Unit Cost',
                'Total Value',
                'Last Updated'
            ]
        ];
    }

    public function map($variant): array
    {
        return [
            $variant->product->name,
            "{$variant->product->sku}{$variant->sku_suffix}",
            $variant->product->category->name ?? 'N/A',
            $variant->quantity,
            $variant->min_stock_level,
            $this->getStockStatus($variant),
            format_idr($variant->product->base_price + $variant->additional_price),
            format_idr($variant->quantity * ($variant->product->base_price + $variant->additional_price)),
            $variant->updated_at->format('Y-m-d H:i')
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
                $highestRow = $sheet->getDelegate()->getHighestRow();

                // Merge header cells
                $sheet->mergeCells('A1:I1');
                $sheet->mergeCells('A2:I2');
                $sheet->mergeCells('A3:I3');
                $sheet->mergeCells('A5:I5');
                $sheet->mergeCells('A6:I6');
                $sheet->mergeCells('A7:I7');
                $sheet->mergeCells('A8:I8');

                // Calculate totals
                $totalItems = 0;
                $totalValue = 0;
                $lowStockCount = 0;
                $outOfStockCount = 0;

                $inventory = $this->collection();
                foreach ($inventory as $item) {
                    $totalItems += $item->quantity;
                    $totalValue += ($item->quantity * ($item->product->base_price + $item->additional_price));
                    if ($item->quantity <= $item->min_stock_level) {
                        $lowStockCount++;
                    }
                    if ($item->quantity <= 0) {
                        $outOfStockCount++;
                    }
                }

                // Add summary rows
                $summaryRow = $highestRow + 2;
                $sheet->setCellValue('A'.$summaryRow, 'SUMMARY:');
                $sheet->getStyle('A'.$summaryRow)->getFont()->setBold(true);

                $sheet->setCellValue('B'.$summaryRow, 'Total Items in Stock:');
                $sheet->setCellValue('C'.$summaryRow, $totalItems);

                $sheet->setCellValue('D'.$summaryRow, 'Total Inventory Value:');
                $sheet->setCellValue('E'.$summaryRow, format_idr($totalValue));

                $sheet->setCellValue('F'.$summaryRow, 'Low Stock Items:');
                $sheet->setCellValue('G'.$summaryRow, $lowStockCount);

                $sheet->setCellValue('H'.$summaryRow, 'Out of Stock:');
                $sheet->setCellValue('I'.$summaryRow, $outOfStockCount);

                // Style summary section
                $sheet->getStyle('A'.$summaryRow.':I'.$summaryRow)->applyFromArray([
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

                // Format numbers
                $sheet->getStyle('D10:D'.$highestRow)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_NUMBER);

                $sheet->getStyle('G10:G'.$highestRow)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

                $sheet->getStyle('H10:H'.$highestRow)
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

                // Zebra striping
                for ($row = 11; $row <= $highestRow; $row++) {
                    if ($row % 2 === 0) {
                        $sheet->getStyle("A{$row}:I{$row}")
                            ->getFill()
                            ->setFillType(Fill::FILL_SOLID)
                            ->getStartColor()
                            ->setRGB('F2F2F2');
                    }
                }

                for ($row = 10; $row <= $highestRow; $row++) {
                    $status = $sheet->getCell('F'.$row)->getValue();
                    $color = '00B050'; // Default green for 'In Stock'

                    if ($status === 'Low Stock') {
                        $color = 'FFC000'; // Orange
                    } elseif ($status === 'Out of Stock') {
                        $color = 'FF0000'; // Red
                    }

                    $sheet->getStyle('F'.$row)
                        ->getFont()
                        ->getColor()
                        ->setARGB($color);
                }

                // Add borders to all data cells
                $sheet->getStyle('A10:I'.$highestRow)
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_THIN);
            },
        ];
    }

    protected function getStockStatusFilter(): string
    {
        if (!$this->filters) return 'All Items';

        if ($this->filters->show_low_stock) {
            return 'Low Stock Items Only';
        }

        return 'All Items';
    }

    protected function getStockStatus($variant): string
    {
        if ($variant->quantity <= 0) {
            return 'Out of Stock';
        }
        if ($variant->quantity <= $variant->min_stock_level) {
            return 'Low Stock';
        }
        return 'In Stock';
    }
}
