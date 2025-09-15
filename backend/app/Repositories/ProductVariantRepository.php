<?php

namespace App\Repositories;

use App\DTO\CreateProductVariantDTO;
use App\DTO\Params\InventoryFilterParams;
use App\DTO\UpdateProductVariantDTO;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProductVariantRepository implements ProductVariantRepositoryInterface
{
    public function findOneById(int $id): ?ProductVariant
    {
        return ProductVariant::query()
            ->with(["product", "saleItems"])
            ->find($id);
    }

    public function findOneByBarcode(string $barcode): ?ProductVariant
    {
        return ProductVariant::query()
            ->where('barcode', $barcode)
            ->first();
    }

    public function findManyByProductId(int $productId): Collection
    {
        return ProductVariant::query()
            ->where('product_id', $productId)
            ->orderByDesc("updated_at")
            ->get();
    }

    public function findMany(): Collection
    {
        return ProductVariant::query()
            ->orderBy("quantity", "asc")
            ->with(["product.supplier", "reorders", "product.category"])
            ->get();
    }

    public function create(Product $product, CreateProductVariantDTO $createProductVariantDTO): ProductVariant
    {
        return $product
            ->variants()
            ->create([
                "attribute" => $createProductVariantDTO->attribute,
                "value" => $createProductVariantDTO->value,
                "sku_suffix" => $createProductVariantDTO->sku_suffix,
                "barcode" => $createProductVariantDTO->barcode,
                "min_stock_level" => $createProductVariantDTO->min_stock_level,
                "additional_price" => $createProductVariantDTO->additional_price,
                "selling_price" => $createProductVariantDTO->selling_price,
                "quantity" => $createProductVariantDTO->quantity,
            ]);
    }

    public function update(
        ProductVariant          $productVariant,
        UpdateProductVariantDTO $updateProductVariantDTO
    ): ProductVariant
    {
        return tap($productVariant)->update([
            "attribute" => $updateProductVariantDTO->attribute,
            "value" => $updateProductVariantDTO->value,
            "sku_suffix" => $updateProductVariantDTO->sku_suffix,
            "barcode" => $updateProductVariantDTO->barcode,
            "min_stock_level" => $updateProductVariantDTO->min_stock_level,
            "additional_price" => $updateProductVariantDTO->additional_price,
            "quantity" => $updateProductVariantDTO->quantity,
            "product_id" => $updateProductVariantDTO->product_id
        ]);
    }

    public function deleteManyByProductId(int $productId): ?bool
    {
        return ProductVariant::query()
            ->where('product_id', $productId)
            ->delete();
    }

    public function delete(ProductVariant $productVariant): ?bool
    {
        return $productVariant->delete();
    }

    public function searchProducts(?string $keyword, int $supplierId): Collection
    {
        $query = ProductVariant::query()
            ->whereHas('product', function ($query) use ($supplierId) {
                if ($supplierId) {
                    $query->where('products.supplier_id', $supplierId);
                }
            })
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->select(
                'product_variants.*',
                'products.name as product_name',
                'products.supplier_id',
                DB::raw("CONCAT(products.name, ' ', product_variants.value) as full_product_name")
            )
            ->with(['product.media', 'product.supplier']);

        if ($keyword) {
            $query->where(function($query) use ($keyword) {
                $query->whereRaw("CONCAT(products.name, ' ', product_variants.value) LIKE ?", ["%{$keyword}%"])
                    ->orWhere('products.name', 'LIKE', "%{$keyword}%")
                    ->orWhere('product_variants.value', 'LIKE', "%{$keyword}%");
            });
        }

        return $query->get();
    }

    public function decrementQuantity(ProductVariant $productVariant, int $quantity): void
    {
        $productVariant->decrement("quantity", $quantity);
    }

    public function incrementQuantity(ProductVariant $productVariant, int $quantity): void
    {
        $productVariant->increment("quantity", $quantity);
    }

    public function findManyLowStockVariant(): Collection
    {
        return ProductVariant::query()
            ->whereColumn('quantity', '<=', 'min_stock_level')
            ->with('product.supplier')
            ->orderByRaw('(quantity - min_stock_level)')
            ->get();
    }

    public function findManyWithFilters(?InventoryFilterParams $inventoryFilterParams): Collection
    {
        return ProductVariant::query()
            ->with(["product.category", "product.supplier"])
            ->when($inventoryFilterParams->product ?? null, function ($query) use ($inventoryFilterParams) {
                $query->whereHas('product', function ($q) use ($inventoryFilterParams) {
                    $q->where("id", $inventoryFilterParams->product);
                });
            })
            ->when($inventoryFilterParams->category ?? null, function ($query) use ($inventoryFilterParams) {
                $query->whereHas('product', function ($q) use ($inventoryFilterParams) {
                    $q->where("category_id", $inventoryFilterParams->category);
                });
            })
            ->when($inventoryFilterParams->show_low_stock === "true", function ($query) {
                $query->whereColumn("quantity", "<=", "min_stock_level");
            })
            ->orderByDesc("updated_at")
            ->get();
    }
}
