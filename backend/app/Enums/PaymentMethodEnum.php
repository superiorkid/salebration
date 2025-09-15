<?php

namespace App\Enums;

enum PaymentMethodEnum: string
{
    case CASH = "cash";
    case CARD = "card";
    case QRIS = "qris";
}
