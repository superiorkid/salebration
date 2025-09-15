<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class StockAudit extends Model
{
    public function productVariant(): BelongsTo{
        return $this->belongsTo(ProductVariant::class);
    }

    public function auditor(): BelongsTo{
        return $this->belongsTo(User::class, 'audited_by_id');
    }

    public function stockHistories(): MorphMany
    {
        return $this->morphMany(StockHistory::class, 'reference');
    }
}
