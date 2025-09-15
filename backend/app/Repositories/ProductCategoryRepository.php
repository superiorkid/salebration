<?php

namespace App\Repositories;

use App\DTO\CreateCategoryDTO;
use App\DTO\DeleteBulkCategoryDTO;
use App\DTO\Params\CategoryFiltersParams;
use App\DTO\UpdateCategoryDTO;
use App\Interfaces\ProductCategoryRepositoryInterface;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Collection;

class ProductCategoryRepository implements ProductCategoryRepositoryInterface
{
    public function categories(CategoryFiltersParams $filters): Collection
    {
        return ProductCategory::query()
            ->orderBy('created_at', "desc")
            ->with("parent")
            ->when($filters->parent_only, function ($query) {
                return $query->whereNull("parent_id");
            })
            ->get();
    }

    public function createCategory(CreateCategoryDTO $createCategoryDTO): ProductCategory
    {
        return ProductCategory::query()
            ->create([
                "name" => $createCategoryDTO->name,
                "description" => $createCategoryDTO->description ?? null,
                "parent_id" => $createCategoryDTO->parentId ?? null,
            ]);
    }

    public function deleteCategory(ProductCategory $productCategory): void
    {
        $productCategory->delete();
    }

    public function updateCategory(ProductCategory $productCategory, UpdateCategoryDTO $updateCategoryDTO): ProductCategory
    {
        return tap($productCategory)->update([
            "name" => $updateCategoryDTO->name,
            "description" => $updateCategoryDTO->description ?? null,
            "parent_id" => $updateCategoryDTO->parentId ?? null,
        ]);
    }

    public function findOneById(int $categoryId): ?ProductCategory
    {
        return ProductCategory::query()
            ->with("parent")
            ->find($categoryId);
    }

    public function findOneByName(string $name): ?ProductCategory
    {
        return ProductCategory::query()
            ->where("name", $name)
            ->with("parent")
            ->first();
    }

    public function deleteBulkCategory(DeleteBulkCategoryDTO $deleteBulkCategoryDTO): void
    {
        ProductCategory::query()
            ->whereIn('id', $deleteBulkCategoryDTO->ids)
            ->delete();
    }
}
