<?php

namespace App\Models;

use Amp\Cancellation;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasRoles, HasApiTokens, HasFactory, Notifiable;


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sales(): HasMany {
        return $this->hasMany(Sale::class);
    }

    public function refunds(): HasMany {
        return $this->hasMany(Refund::class);
    }

    public function activityLogs(): HasMany {
        return $this->hasMany(ActivityLog::class);
    }

    public function reorderCancellations(): HasMany {
        return $this->hasMany(Reorder::class);
    }

    public function purchaseOrderCancellations(): HasMany {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function stockAudits(): HasMany
    {
        return $this->hasMany(StockAudit::class, 'audited_by_id');
    }
}
