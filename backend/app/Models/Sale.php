<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Sale extends Model
{

    public function operator(): BelongsTo {
        return $this->belongsTo(User::class, "operator_id");
    }

    public function items(): HasMany {
        return $this->hasMany(SaleItem::class);
    }

    public function payments(): HasMany {
        return $this->hasMany(Payment::class);
    }

    public function refund(): HasOne {
        return $this->hasOne(Refund::class);
    }

    public function invoice():HasOne {
        return $this->hasOne(Invoice::class);
    }

    public function customer(): BelongsTo {
        return $this->belongsTo(Customer::class);
    }

    public function stockHistories(): MorphMany
    {
        return $this->morphMany(StockHistory::class, 'reference');
    }
}
