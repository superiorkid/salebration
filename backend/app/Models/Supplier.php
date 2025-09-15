<?php

namespace App\Models;

use App\Observers\SupplierObserver;
use App\Traits\HasImageUpload;
use Database\Factories\SupplierFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[ObservedBy([SupplierObserver::class])]
class Supplier extends Model implements HasMedia
{
    /** @use HasFactory<SupplierFactory> */
    use HasFactory, interactsWithMedia, HasImageUpload, Notifiable;


    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function routeNotificationForMail(): string
    {
        return $this->email;
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
