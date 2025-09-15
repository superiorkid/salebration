<?php

namespace App\Models;

use App\Observers\CompanyObserver;
use App\Traits\HasImageUpload;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[ObservedBy([CompanyObserver::class])]
class Company extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasImageUpload;
}
