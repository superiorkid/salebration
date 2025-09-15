<?php

namespace App\Http\Controllers;

use App\DTO\StockAuditDTO;
use App\Services\StockAuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StockAuditController extends Controller
{
    protected StockAuditService $stockAuditService;

    public function __construct(
        StockAuditService $stockAuditService
    )
    {
        $this->stockAuditService = $stockAuditService;
    }

    public function stockAudits(Request $request): JsonResponse
    {
        $variantId = $request->query('variant_id');
        return $this->stockAuditService->stockAudits($variantId);
    }

    public function createStockAudit(StockAuditDTO $stockAuditDTO): JsonResponse
    {
        return $this->stockAuditService->createStockAudit($stockAuditDTO);
    }

    public function deleteStockAudit(string $stock_audit_id): JsonResponse
    {
        return $this->stockAuditService->deleteStockAudit((int) $stock_audit_id);
    }
}
