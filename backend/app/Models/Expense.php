<?php

namespace App\Models;

use App\Observers\ExpenseObserver;
use App\Traits\HasImageUpload;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[ObservedBy([ExpenseObserver::class])]
class Expense extends Model implements HasMedia
{
    use InteractsWithMedia, HasImageUpload;

    public function category(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class);
    }
}
