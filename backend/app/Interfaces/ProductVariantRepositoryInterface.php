<?php

namespace App\Interfaces;

use App\DTO\CreateProductVariantDTO;
use App\DTO\Params\InventoryFilterParams;
use App\DTO\UpdateProductVariantDTO;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;

interface ProductVariantRepositoryInterface
{
    public function findOneById(int $id): ?ProductVariant;

    public function findOneByBarcode(string $barcode): ?ProductVariant;

    public function findManyByProductId(int $productId): Collection;

    public function findMany(): Collection;

    public function create(Product $product, CreateProductVariantDTO $createProductVariantDTO): ProductVariant;

    public function update(
        ProductVariant          $productVariant,
        UpdateProductVariantDTO $updateProductVariantDTO
    ): ProductVariant;

    public function delete(ProductVariant $productVariant): ?bool;

    public function deleteManyByProductId(int $productId): ?bool;

    public function searchProducts(?string $keyword, int $supplierId): Collection;
    public function incrementQuantity(ProductVariant $productVariant, int $quantity): void;
    public function decrementQuantity(ProductVariant $productVariant, int $quantity): void;
    public function findManyLowStockVariant(): Collection;
    public function findManyWithFilters(?InventoryFilterParams $inventoryFilterParams): Collection;
}
