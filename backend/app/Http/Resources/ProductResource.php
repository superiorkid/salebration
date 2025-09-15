<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            "sku" => $this->sku,
            "name" => $this->name,
            "slug" => $this->slug,
            "description" => $this->description ?? null,
            "image" => $this->getFirstMediaUrl("product_image"),
            "base_price" => $this->base_price ?? 0,
            "status" => $this->status,
            "category_id" => $this->category_id,
            "category" => $this->whenLoaded("category"),
            "supplier_id" => $this->supplier_id,
            "supplier" => SupplierResource::make($this->whenLoaded("supplier")),
            "variants" => ProductVariantResource::collection($this->whenLoaded("variants")),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
