<?php

namespace App\Models;

use App\Traits\HasImageUpload;
use Database\Factories\ProductVariantFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ProductVariant extends Model implements HasMedia
{
    /** @use HasFactory<ProductVariantFactory> */
    use HasFactory, InteractsWithMedia, HasImageUpload;

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function saleItems(): HasMany {
        return $this->hasMany(SaleItem::class);
    }

    public function reorders(): HasMany {
        return $this->hasMany(Reorder::class);
    }

    public function purchaseOrderItem(): HasMany {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function stockAudits(): HasMany {
        return $this->hasMany(StockAudit::class);
    }
}
