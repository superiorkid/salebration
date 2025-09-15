<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\CreateCategoryDTO;
use App\DTO\DeleteBulkCategoryDTO;
use App\DTO\Params\CategoryFiltersParams;
use App\DTO\UpdateCategoryDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\ProductCategoryRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProductCategoryService
{
    protected ProductCategoryRepositoryInterface $productCategoryRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    public function __construct(
        ProductCategoryRepositoryInterface $productCategoryRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface
    )
    {
        $this->productCategoryRepositoryInterface = $productCategoryRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }


    public function getProductCategories(CategoryFiltersParams $filters): JsonResponse
    {
        try {
            $categories = $this->productCategoryRepositoryInterface->categories($filters);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_PRODUCT_CATEGORY,
                description: "View Product Categories",
                subjectType: "ProductCategory",
                subjectId: "-",
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "get categories successfully",
                    "data" => $categories], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    'success' => false, 'message' => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createCategory(CreateCategoryDTO $createCategoryDTO): JsonResponse
    {
        $category = $this
            ->productCategoryRepositoryInterface
            ->findOneByName($createCategoryDTO->name);
        if ($category) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Product category already exists"
                ], JsonResponse::HTTP_CONFLICT);
        }

        try {
            $productCategory = $this
                ->productCategoryRepositoryInterface
                ->createCategory($createCategoryDTO);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::CREATE_PRODUCT_CATEGORY,
                description: "Create Product Category",
                subjectType: "ProductCategory",
                subjectId: $productCategory->id,
                data: json_encode($createCategoryDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json([
                "success" => true,
                "message" => "Product category created successfully"
            ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'success' => false, 'message' => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detailCategory(int $category_id): JsonResponse
    {
        try {
            $category = $this
                ->productCategoryRepositoryInterface
                ->findOneById($category_id);
            if (!$category) {
                return response()
                    ->json([
                        "success" => false,
                        "message" => "Category not found"
                    ], JsonResponse::HTTP_NOT_FOUND);
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_PRODUCT_CATEGORY,
                description: "View Product Category",
                subjectType: "ProductCategory",
                subjectId: $category->id,
                data: json_encode($category->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "get category successfully",
                    "data" => $category
                ]);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updateCategory(int $categoryId, UpdateCategoryDTO $updateCategoryDTO): JsonResponse
    {
        $category = $this
            ->productCategoryRepositoryInterface
            ->findOneById($categoryId);

        // prevent self parenting
        if ($category->id === $updateCategoryDTO->parentId) {
            return response()->json([
                "success" => false,
                "message" => "A category cannot be its own parent"
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($category && $category->id != $categoryId) {
            return response()
                ->json(["success" => false, "message" => "Category already exists"], JsonResponse::HTTP_CONFLICT);
        }


        try {
            $this->productCategoryRepositoryInterface->updateCategory($category, $updateCategoryDTO);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::UPDATE_PRODUCT_CATEGORY,
                description: "Update Product Category",
                subjectType: "ProductCategory",
                subjectId: $category->id,
                data: json_encode($updateCategoryDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json(["success" => true, "message" => "Category updated successfully"], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(["success" => false, "message" => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteCategory(int $category_id): JsonResponse
    {
        $category = $this
            ->productCategoryRepositoryInterface
            ->findOneById($category_id);
        if (!$category) {
            return response()->json(["success" => false, "message" => "Category not found"], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->productCategoryRepositoryInterface->deleteCategory($category);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::DELETE_PRODUCT_CATEGORY,
                description: "Delete Product Category",
                subjectType: "ProductCategory",
                subjectId: $category_id,
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json(["success" => true, "message" => "Category deleted successfully"], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(["success" => false, "message" => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteBulkCategory(DeleteBulkCategoryDTO $deleteBulkCategoryDTO): JsonResponse
    {
        try {
            $this
                ->productCategoryRepositoryInterface
                ->deleteBulkCategory($deleteBulkCategoryDTO);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::DELETE_PRODUCT_CATEGORY,
                description: "Delete Product Categories",
                subjectType: "ProductCategory",
                subjectId: "-",
                data: json_encode($deleteBulkCategoryDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json(["success" => true, "message" => "Bulk deleted successfully"], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(["success" => false, "message" => "Unable to delete bulk product category"], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
