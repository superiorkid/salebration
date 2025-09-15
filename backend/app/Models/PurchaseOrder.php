<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class PurchaseOrder extends Model
{
    public function getExpectedAtAttribute($value): ?Carbon
    {
        return $value ? Carbon::parse($value) : null;
    }

    public function getAcceptedAtAttribute($value): ?Carbon
    {
        return $value ? Carbon::parse($value) : null;
    }

    public function getRejectedAtAttribute($value): ?Carbon
    {
        return $value ? Carbon::parse($value) : null;
    }

    public function getCancelledAtAttribute($value): ?Carbon
    {
        return $value ? Carbon::parse($value) : null;
    }

    public function getReceivedAtAttribute($value): ?Carbon
    {
        return $value ? Carbon::parse($value) : null;
    }

    public function purchaseOrderItems(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function cancelled_by(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function stockHistories(): MorphMany
    {
        return $this->morphMany(StockHistory::class, 'reference');
    }
}
