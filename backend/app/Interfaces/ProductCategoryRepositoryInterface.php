<?php

namespace App\Interfaces;

use App\DTO\CreateCategoryDTO;
use App\DTO\DeleteBulkCategoryDTO;
use App\DTO\Params\CategoryFiltersParams;
use App\DTO\UpdateCategoryDTO;
use App\Models\ProductCategory;

interface ProductCategoryRepositoryInterface
{
    public function categories(CategoryFiltersParams $filters);

    public function createCategory(CreateCategoryDTO $createCategoryDTO);

    public function findOneById(int $categoryId);

    public function findOneByName(string $name);

    public function updateCategory(ProductCategory $productCategory, UpdateCategoryDTO $updateCategoryDTO): ProductCategory;

    public function deleteCategory(ProductCategory $productCategory);

    public function deleteBulkCategory(DeleteBulkCategoryDTO $deleteBulkCategoryDTO);
}
