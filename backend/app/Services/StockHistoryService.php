<?php

namespace App\Services;

use App\Interfaces\StockHistoryRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;

class StockHistoryService
{
    protected StockHistoryRepositoryInterface $stockHistoryRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        StockHistoryRepositoryInterface $stockHistoryRepositoryInterface
    )
    {
        $this->stockHistoryRepositoryInterface = $stockHistoryRepositoryInterface;
    }

    public function stockHistories(int $productVariantId): JsonResponse
    {
        try {
            $stockHistories = $this->stockHistoryRepositoryInterface->findManyByProductVariantId($productVariantId);
            return response()->json([
                "success" => true,
                "message" => "Stock histories retrieved successfully.",
                "data" => $stockHistories
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detailStockHistory(int $stockHistoryId): JsonResponse
    {
        try {
            $stockHistory = $this->stockHistoryRepositoryInterface->findOneById($stockHistoryId);
            if (empty($stockHistory)) {
                return response()->json([
                    "success" => false,
                    "message" => "Stock history not found."
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "message" => "Stock history retrieved successfully.",
                "data" => $stockHistory
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteStockHistory(int $stockHistoryId): JsonResponse
    {
        $stockHistory = $this->stockHistoryRepositoryInterface->findOneById($stockHistoryId);
        if (empty($stockHistory)) {
            return response()->json([
                "success" => false,
                "message" => "Stock history not found."
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->stockHistoryRepositoryInterface->delete($stockHistory);
            return response()->json([
                "success" => true,
                "message" => "Stock history deleted successfully."
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
