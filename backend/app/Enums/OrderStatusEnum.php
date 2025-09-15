<?php

namespace App\Enums;

enum OrderStatusEnum: string
{
    case PENDING   = 'pending';
    case ACCEPTED  = 'accepted';
    case REJECTED  = 'rejected';
    case PARTIAL   = 'partial';
    case RECEIVED  = 'received';
    case CANCELLED = 'cancelled';
}
