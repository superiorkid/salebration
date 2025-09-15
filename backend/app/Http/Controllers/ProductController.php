<?php

namespace App\Http\Controllers;

use App\DTO\CreateProductDTO;
use App\DTO\UpdateProductDTO;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function products(): JsonResponse
    {
        return $this->productService->products();
    }

    public function createProduct(CreateProductDTO $createProductDTO): JsonResponse
    {
        return $this->productService->createProduct($createProductDTO);
    }

    public function updateProduct(UpdateProductDTO $updateProductDTO, int $product_id): JsonResponse
    {
        return $this->productService->updateProduct($product_id, $updateProductDTO);
    }

    public function detailProduct(int $product_id): JsonResponse
    {
        return $this->productService->detailProduct($product_id);
    }

    public function deleteProduct(int $product_id): JsonResponse
    {
        return $this->productService->deleteProduct($product_id);
    }
}
