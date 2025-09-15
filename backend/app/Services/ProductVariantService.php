<?php

namespace App\Services;

use App\Interfaces\ProductVariantRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;

class ProductVariantService
{
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(ProductVariantRepositoryInterface $productVariantRepositoryInterface)
    {
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
    }


    public function stocks(): JsonResponse
    {
        try {
            $variants = $this->productVariantRepositoryInterface->findMany();
            return response()->json([
                "success" => true,
                "message" => "get variants successfully",
                "data" => $variants->toResourceCollection()
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function searchProducts(?string $keyword, int $supplier_id): JsonResponse
    {
        try {
            $variants = $this
                ->productVariantRepositoryInterface
                ->searchProducts($keyword, $supplier_id)
                ->toResourceCollection();

            return response()->json([
                "success" => true,
                "message" => "Get product successfully",
                "data" => $variants,
            ], JsonResponse::HTTP_OK);
        }  catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detailProductVariant(string $variant_id): JsonResponse
    {
        try {
            $variant = $this->productVariantRepositoryInterface->findOneById($variant_id);
            if (empty($variant)) {
                return response()->json([
                    "success" => false,
                    "message" => "Variant not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "message" => "get variant successfully",
                "data" => $variant
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
