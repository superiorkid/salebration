<?php

namespace App\Models;

use Database\Factories\ProductCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends Model
{
    /** @use HasFactory<ProductCategoryFactory> */
    use HasFactory;
    
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, "parent_id");
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

}
