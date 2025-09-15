<?php

namespace App\Enums;

enum OrderValidationTypeEnum: string
{
    case PURCHASE_ORDER = 'purchase-order';
    case REORDER = 'reorder';
}
