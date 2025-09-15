<?php

namespace App\Enums;

enum FinancialPeriodParamsEnum: string
{
    case MONTHLY = "monthly";
    case QUARTERLY = "quarterly";
    case YEARLY = "yearly";
    case CUSTOM = "custom";
}
