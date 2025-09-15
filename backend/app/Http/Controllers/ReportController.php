<?php

namespace App\Http\Controllers;

use App\DTO\Params\FinancialFilterParams;
use App\DTO\Params\InventoryFilterParams;
use App\DTO\Params\SaleFiltersParams;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class   ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(
        ReportService $reportService
    )
    {
        $this->reportService = $reportService;
    }

    public function salesReport(SaleFiltersParams $filters):JsonResponse
    {
        return $this->reportService->salesReport($filters);
    }

    public function salesReportExport(SaleFiltersParams $filters): BinaryFileResponse
    {
        return $this->reportService->salesReportExport($filters);
    }

    public function inventoryReport(InventoryFilterParams $filters):JsonResponse
    {
        return $this->reportService->inventoryReport($filters);
    }

    public function inventoryReportExport(InventoryFilterParams $filters): BinaryFileResponse
    {
        return $this->reportService->inventoryReportExport($filters);
    }

    public function financialReport(FinancialFilterParams $filters):JsonResponse
    {
        return $this->reportService->financialReport($filters);
    }

    public function financialReportExport(FinancialFilterParams $filters): BinaryFileResponse
    {
        return $this->reportService->financialReportExport($filters);
    }
}
