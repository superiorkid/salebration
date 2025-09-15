<?php

namespace App\Interfaces;

use App\DTO\CreateProductDTO;
use App\DTO\UpdateProductDTO;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface
{
    public function findOneById(int $id): ?Product;

    public function findOneBySlug(string $slug): ?Product;

    public function findOneByName(string $name): ?Product;

    public function findManyByCategoryId(ProductCategory $productCategory): Collection;

    public function findManyBySupplierId(Supplier $supplier): Collection;

    public function findMany(): Collection;

    public function create(CreateProductDTO $createProductDTO): Product;

    public function update(Product $product, UpdateProductDTO $updateProductDTO): Product;

    public function delete(Product $product): ?bool;
}
