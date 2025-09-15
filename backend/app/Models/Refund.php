<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Refund extends Model
{
    public function sale(): BelongsTo {
        return $this->belongsTo(Sale::class);
    }

    public function refundedBy(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function stockHistories(): MorphMany
    {
        return $this->morphMany(StockHistory::class, 'reference');
    }
}
