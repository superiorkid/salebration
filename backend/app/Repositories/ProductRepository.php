<?php

namespace App\Repositories;

use App\DTO\CreateProductDTO;
use App\DTO\UpdateProductDTO;
use App\Interfaces\ProductRepositoryInterface;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ProductRepository implements ProductRepositoryInterface
{
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;

    public function __construct(ProductVariantRepositoryInterface $productVariantRepositoryInterface)
    {
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
    }

    public function findOneById(int $id): ?Product
    {
        return Product::query()
            ->with(["variants", "category", "supplier"])
            ->find($id);

    }

    public function findOneBySlug(string $slug): ?Product
    {
        return Product::query()
            ->where("slug", $slug)
            ->with(["variants", "category", "supplier"])
            ->first();
    }

    public function findOneByName(string $name): ?Product
    {
        return Product::query()
            ->where("name", $name)
            ->with(["variants", "category", "supplier"])
            ->first();
    }

    public function findManyByCategoryId(ProductCategory $productCategory): Collection
    {
        return Product::query()
            ->whereBelongsTo($productCategory)
            ->orderBy("created_at", "desc")
            ->with(["variants", "category", "supplier"])
            ->get();
    }

    public function findManyBySupplierId(Supplier $supplier): Collection
    {
        return Product::query()
            ->whereBelongsTo($supplier)
            ->orderBy("created_at", "desc")
            ->with(["variants", "category", "supplier"])
            ->get();
    }

    public function findMany(): Collection
    {
        return Product::query()
            ->orderBy("updated_at", "desc")
            ->with(["category", "variants", "supplier"])
            ->get();
    }

    public function update(Product $product, UpdateProductDTO $updateProductDTO): Product
    {
        return tap($product)->update([
            "name" => $updateProductDTO->name,
            "sku" => $updateProductDTO->sku,
            "description" => $updateProductDTO->description,
            "slug" => Str::slug($updateProductDTO->name),
            "status" => $updateProductDTO->status,
            "base_price" => $updateProductDTO->base_price,
            "category_id" => $updateProductDTO->category_id,
            "supplier_id" => $updateProductDTO->supplier_id,
        ]);
    }

    public function create(CreateProductDTO $createProductDTO): Product
    {
        return Product::query()
            ->create([
                "name" => $createProductDTO->name,
                "sku" => $createProductDTO->sku,
                "description" => $createProductDTO->description,
                "slug" => Str::slug($createProductDTO->name),
                "status" => $createProductDTO->status,
                "base_price" => $createProductDTO->base_price,
                "category_id" => $createProductDTO->category_id,
                "supplier_id" => $createProductDTO->supplier_id,
            ]);
    }

    public function delete(Product $product): ?bool
    {
        return $product->delete();
    }
}
