<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use App\Services\ProductVariantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductVariantController extends Controller
{

    protected ProductVariantService $productVariantService;

    public function __construct(Productvariantservice $productVariantService)
    {
        $this->productVariantService = $productVariantService;
    }

    public function stocks(): JsonResponse
    {
        return $this->productVariantService->stocks();
    }

   public function searchProducts(Request $request): JsonResponse
   {
        $keyword = trim($request->query('keyword'));
        $supplierId = $request->query('supplier_id');

        return $this->productVariantService->searchProducts($keyword, (int) $supplierId);
   }


   public function detailProductVariant(string $variant_id): JsonResponse
   {
        return $this->productVariantService->detailProductVariant($variant_id);
   }

}
