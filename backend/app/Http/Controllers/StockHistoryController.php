<?php

namespace App\Http\Controllers;

use App\Services\StockHistoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockHistoryController extends Controller
{
    protected StockHistoryService $stockHistoryService;

    public function __construct(
        StockHistoryService $stockHistoryService
    )
    {
        $this->stockHistoryService = $stockHistoryService;
    }

    public function stockHistories(Request $request): JsonResponse
    {
        $variantId = $request->query('variant_id');
        return $this->stockHistoryService->stockHistories($variantId);
    }

    public function detailStockHistory(string $stock_history_id): JsonResponse
    {
        return $this->stockHistoryService->detailStockHistory((int) $stock_history_id);
    }

    public function deleteStockHistory(string $stock_history_id): JsonResponse
    {
        return $this->stockHistoryService->deleteStockHistory((int) $stock_history_id);
    }
}
