<?php

namespace App\Http\Controllers;

use App\DTO\CreateCategoryDTO;
use App\DTO\DeleteBulkCategoryDTO;
use App\DTO\Params\CategoryFiltersParams;
use App\DTO\UpdateCategoryDTO;
use App\Services\ProductCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Log;

class ProductCategoryController extends Controller
{

    protected ProductCategoryService $productCategoryService;

    public function __construct(ProductCategoryService $productCategoryService)
    {
        $this->productCategoryService = $productCategoryService;
    }

    public function categories(Request $request): JsonResponse
    {
        $parentOnly = filter_var($request->query('parent_only'), FILTER_VALIDATE_BOOLEAN);
        $filters = new CategoryFiltersParams($parentOnly);
        return $this->productCategoryService->getProductCategories($filters);
    }

    public function createCategory(CreateCategoryDTO $createCategoryDTO): JsonResponse
    {
        return $this->productCategoryService->createCategory($createCategoryDTO);
    }

    public function detailCategory(int $category_id): JsonResponse
    {
        return $this->productCategoryService->detailCategory($category_id);
    }

    public function updateCategory(UpdateCategoryDTO $updateCategoryDTO, int $category_id): JsonResponse
    {
        return $this->productCategoryService->updateCategory($category_id, $updateCategoryDTO);
    }

    public function deleteCategory(int $category_id): JsonResponse
    {
        return $this->productCategoryService->deleteCategory($category_id);
    }

    public function bulkDeleteCategory(DeleteBulkCategoryDTO $deleteBulkCategoryDTO): JsonResponse
    {
        Log::debug($deleteBulkCategoryDTO);
        return $this->productCategoryService->deleteBulkCategory($deleteBulkCategoryDTO);
    }
}
