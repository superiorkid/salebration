<?php

namespace App\Repositories;

use App\DTO\ExpenseCategoryDTO;
use App\Interfaces\ExpenseCategoryRepositoryInterface;
use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Collection;

class ExpenseCategoryRepository implements ExpenseCategoryRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findOneById(int $id): ?ExpenseCategory
    {
        return ExpenseCategory::query()
            ->find($id);
    }

    public function findOneByName(string $name): ?ExpenseCategory
    {
        return ExpenseCategory::query()
            ->where('name', $name)
            ->first();
    }

    public function findMany(): Collection
    {
        return ExpenseCategory::query()
            ->get();
    }

    public function create(ExpenseCategoryDTO $expenseCategoryDTO): ExpenseCategory
    {
        return ExpenseCategory::query()
            ->create(["name" => $expenseCategoryDTO->name]);
    }

    public function delete(ExpenseCategory $expenseCategory): void
    {
        $expenseCategory->delete();
    }
}
