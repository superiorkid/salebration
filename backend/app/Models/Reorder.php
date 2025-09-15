<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Reorder extends Model
{
    protected $casts = ["expected_at" => "datetime"];

    public function product_variant(): BelongsTo {
        return $this->belongsTo(ProductVariant::class);
    }

    public function cancelled_by(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function stockHistories(): MorphMany
    {
        return $this->morphMany(StockHistory::class, 'reference');
    }
}
