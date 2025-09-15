<?php

namespace App\Services;

use App\DTO\ExpenseCategoryDTO;
use App\Interfaces\ExpenseCategoryRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;

class ExpenseCategoryService
{
    protected ExpenseCategoryRepositoryInterface $expenseCategoryRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        ExpenseCategoryRepositoryInterface $expenseCategoryRepositoryInterface
    )
    {
        $this->expenseCategoryRepositoryInterface = $expenseCategoryRepositoryInterface;
    }

    public function categories(): JsonResponse
    {
        try {
            $categories = $this->expenseCategoryRepositoryInterface->findMany();
            return response()->json([
                "success" => true,
                "message" => "Expense Category Retrieved",
                "data" => $categories
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createCategory(ExpenseCategoryDTO $expenseCategoryDTO): JsonResponse
    {
        try {
            $this->expenseCategoryRepositoryInterface->create($expenseCategoryDTO);
            return response()->json([
                "success" => true,
                "message" => "Expense Category successfully created",
            ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteCategory(int $categoryId): JsonResponse
    {
        $category = $this->expenseCategoryRepositoryInterface->findOneById($categoryId);
        if (empty($category)) {
            return response()->json([
                "success" => false,
                "message" => "Expense Category not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->expenseCategoryRepositoryInterface->delete($category);
            return response()->json([
                "success" => true,
                "message" => "Expense Category successfully deleted",
            ], JSonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
