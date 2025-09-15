<?php

namespace App\Repositories;

use App\DTO\CreateSaleDTO;
use App\DTO\Params\SaleFiltersParams;
use App\Enums\FinancialPeriodParamsEnum;
use App\Enums\SaleStatusEnum;
use App\Interfaces\SaleRepositoryInterface;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class SaleRepository implements SaleRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findMany(?SaleFiltersParams $filters = null): Collection
    {
        $query = Sale::query()
            ->with(["operator", "items.productVariant.product", "payments", "invoice", "customer"]);

        if ($filters) {
            $query->when(filled($filters->start_date) && filled($filters->end_date), function (Builder $builder) use ($filters) {
                $startDate = Carbon::parse($filters->start_date)->startOfDay();
                $endDate = Carbon::parse($filters->end_date)->endOfDay();

                $builder->whereBetween('created_at', [$startDate, $endDate]);
            })
                ->when(filled($filters->operator), function (Builder $builder) use ($filters) {
                    $builder->where('operator_id', $filters->operator);
                })
                ->when(filled($filters->status), function (Builder $builder) use ($filters) {
                    $builder->where('status', $filters->status);
                })
                ->when(filled($filters->payment_method), function (Builder $builder) use ($filters) {
                    $builder->whereHas("payments", function (Builder $b) use ($filters) {
                        $b->where("method", $filters->payment_method);
                    });
                })
            ->when(!$filters->show_refunded && empty($filters->status), function (Builder $builder) use ($filters) {
                $builder->where('status', "!=", SaleStatusEnum::REFUNDED->value);
            });
        }

        return $query->orderByDesc('created_at')->get();
    }

    public function findManyByStatus(SaleStatusEnum $status): Collection
    {
        return Sale::query()
            ->where("status", $status)
            ->with(["operator", "items.productVariant.product", "payments", "invoice", "customer"])
            ->orderBy("created_at", "DESC")
            ->get();
    }

    public function findOneById(int $id): ?Sale
    {
        return Sale::query()
            ->with(["operator", "items.productVariant.product", "payments", "invoice", "customer"])
            ->find($id);
    }

    public function create(CreateSaleDTO $createSaleDTO, ?SaleStatusEnum $status = null): Sale
    {
        return Sale::query()->create([
            "total" => $createSaleDTO->total,
            "paid" => $createSaleDTO->paid,
            "change" => $createSaleDTO->change,
            "status" => $status ?? SaleStatusEnum::PAID->value,
            "operator_id" => Auth::id(),
        ]);
    }

    public function findAllTodaySales(): Builder
    {
        return Sale::query()->whereDate("created_at", today());
    }

    public function getDateRangeFromPeriod(
        FinancialPeriodParamsEnum $period,
        ?Carbon $start_date = null,
        ?Carbon $end_date = null
    ): array
    {
        return match ($period) {
            FinancialPeriodParamsEnum::MONTHLY => [
                "start_date" => now()->startOfMonth(),
                "end_date" => now()->endOfMonth(),
            ],
            FinancialPeriodParamsEnum::QUARTERLY => [
                "start_date" => now()->startOfQuarter(),
                "end_date" => now()->endOfQuarter(),
            ],
            FinancialPeriodParamsEnum::YEARLY => [
                "start_date" => now()->startOfYear(),
                "end_date" => now()->endOfYear(),
            ],
            FinancialPeriodParamsEnum::CUSTOM => [
                'start_date' => $start_date ?? throw new \InvalidArgumentException('Custom period requires start_date'),
                'end_date' => $end_date ?? throw new \InvalidArgumentException('Custom period requires end_date'),
            ]
        };
    }
}
