<?php

namespace App\Enums;

enum SaleStatusEnum: string
{
    case PAID = 'paid';
    case PENDING = 'pending';
    case REFUNDED = 'refunded';
}
