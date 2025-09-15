<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleItem extends Model
{
    public function sale(): BelongsTo {
        return $this->belongsTo(Sale::class);
    }

    public function productVariant(): BelongsTo {
        return $this->belongsTo(ProductVariant::class);
    }
}
