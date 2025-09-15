<?php

namespace App\Enums;

enum StockHistoryTypeEnum: string
{
    case SALE = 'sale';
    case REFUND = 'refund';
    case REORDER = 'reorder';
    case PURCHASE = 'purchase';
    case ADJUSTMENT = 'adjustment';
    case AUDIT = 'audit';
    case MANUAL = 'manual';
}
