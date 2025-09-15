<?php

namespace App\Http\Controllers;

use App\DTO\ExpenseCategoryDTO;
use App\Services\ExpenseCategoryService;
use Illuminate\Http\JsonResponse;

class ExpenseCategoryController extends Controller
{
    protected ExpenseCategoryService $expenseCategoryService;

    public function __construct(
        ExpenseCategoryService $expenseCategoryService
    )
    {
        $this->expenseCategoryService = $expenseCategoryService;
    }

    public function categories(): JsonResponse
    {
        return $this->expenseCategoryService->categories();
    }

    public function createCategory(ExpenseCategoryDTO $expenseCategoryDTO): JsonResponse
    {
        return $this->expenseCategoryService->createCategory($expenseCategoryDTO);
    }

    public function deleteCategory(string $category_id): JsonResponse
    {
        return $this->expenseCategoryService->deleteCategory((int) $category_id);
    }
}
