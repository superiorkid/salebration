<?php

namespace App\Interfaces;

use App\DTO\CreateSaleDTO;
use App\DTO\Params\SaleFiltersParams;
use App\Enums\FinancialPeriodParamsEnum;
use App\Enums\SaleStatusEnum;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

interface SaleRepositoryInterface
{
    public function findOneById(int $id): ?Sale;
    public function findMany(?SaleFiltersParams $filters):Collection;
    public function findManyByStatus(SaleStatusEnum $status): Collection;
    public function create(CreateSaleDTO $createSaleDTO, ?SaleStatusEnum $status): Sale;
    public function findAllTodaySales(): Builder;
    public function getDateRangeFromPeriod(
        FinancialPeriodParamsEnum $period,
        ?Carbon $start_date,
        ?Carbon $end_date
    ): array;
}
