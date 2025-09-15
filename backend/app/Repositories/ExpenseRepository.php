<?php

namespace App\Repositories;

use App\DTO\CreateExpensesDTO;
use App\DTO\Params\ExpenseFiltersParams;
use App\DTO\UpdateExpensesDTO;
use App\Interfaces\ExpenseRepositoryInterface;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

class ExpenseRepository implements ExpenseRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findMany(?ExpenseFiltersParams $filters = null): Collection
    {
        $query =  Expense::query()
            ->with(['category', 'media']);

        if ($filters) {
            $query->when(
                filled($filters->start_date) && filled($filters->end_date),
                function (Builder $builder) use ($filters) {
                    $startDate = Carbon::parse($filters->start_date)->startOfDay();
                    $endDate = Carbon::parse($filters->end_date)->endOfDay();

                    $builder->whereBetween('created_at', [$startDate, $endDate]);
                });
        }

        return $query
            ->orderByDesc('created_at')
            ->get();
    }

    public function findManyByCategory(int $categoryId): Collection
    {
        return Expense::query()
            ->with(['category', 'media'])
            ->where('category_id', $categoryId)
            ->get();
    }

    public function findOneById(int $id): ?Expense
    {
        return Expense::query()
            ->with(['category', 'media'])
            ->find($id);
    }

    public function create(CreateExpensesDTO $createExpensesDTO): ?Expense
    {
        return Expense::query()
            ->create([
                "title" => $createExpensesDTO->title,
                "description" => $createExpensesDTO->description ?? null,
                "amount" => $createExpensesDTO->amount,
                "paid_at" => $createExpensesDTO->paid_at,
                "category_id" => $createExpensesDTO->category_id,
            ]);
    }

    public function update(Expense $expense, UpdateExpensesDTO $updateExpensesDTO): void
    {
        $expense->update([
            "title" => $updateExpensesDTO->title,
            "description" => $updateExpensesDTO->description ?? null,
            "amount" => $updateExpensesDTO->amount,
            "paid_at" => $updateExpensesDTO->paid_at,
            "category_id" => $updateExpensesDTO->category_id,
        ]);
    }

    public function delete(Expense $expense): void
    {
        $expense->delete();
    }
}
