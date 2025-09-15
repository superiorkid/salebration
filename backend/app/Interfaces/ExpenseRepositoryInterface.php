<?php

namespace App\Interfaces;

use App\DTO\CreateExpensesDTO;
use App\DTO\Params\ExpenseFiltersParams;
use App\DTO\UpdateExpensesDTO;
use App\Models\Expense;
use Illuminate\Database\Eloquent\Collection;

interface ExpenseRepositoryInterface
{
    public function findMany(?ExpenseFiltersParams $filters): Collection;
    public function findManyByCategory(int $categoryId): Collection;
    public function findOneById(int $id): ?Expense;
    public function create(CreateExpensesDTO $createExpensesDTO): ?Expense;
    public function update(Expense $expense, UpdateExpensesDTO $updateExpensesDTO): void;
    public function delete(Expense $expense): void;
}
