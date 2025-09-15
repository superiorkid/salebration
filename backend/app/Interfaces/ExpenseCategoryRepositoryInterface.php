<?php

namespace App\Interfaces;

use App\DTO\ExpenseCategoryDTO;
use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Collection;

interface ExpenseCategoryRepositoryInterface
{
    public function findMany(): Collection;
    public function findOneById(int $id): ?ExpenseCategory;
    public function findOneByName(string $name): ?ExpenseCategory;
    public function create(ExpenseCategoryDTO $expenseCategoryDTO): ExpenseCategory;
    public function delete(ExpenseCategory $expenseCategory): void;
}
