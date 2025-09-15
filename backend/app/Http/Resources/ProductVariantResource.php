<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "attribute" => $this->attribute,
            "value" => $this->value,
            "product_id" => $this->product_id,
            "product" => ProductResource::make($this->whenLoaded("product")),
            "sku_suffix" => $this->sku_suffix,
            "image" => $this->getFirstMediaUrl("product_variant_image"),
            "barcode" => $this->barcode ?? null,
            "additional_price" => $this->additional_price,
            "selling_price" => $this->selling_price,
            "quantity" => $this->quantity,
            "min_stock_level" => $this->min_stock_level,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "reorders" => $this->whenLoaded("reorders"),
        ];
    }
}
