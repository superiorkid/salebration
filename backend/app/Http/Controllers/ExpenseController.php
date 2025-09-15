<?php

namespace App\Http\Controllers;

use App\DTO\CreateExpensesDTO;
use App\DTO\UpdateExpensesDTO;
use App\Services\ExpenseService;
use Illuminate\Http\JsonResponse;

class ExpenseController extends Controller
{
    protected ExpenseService $expenseService;

    public function __construct(
        ExpenseService $expenseService
    )
    {
        $this->expenseService = $expenseService;
    }


    public function expenses(): JsonResponse
    {
        return $this->expenseService->expenses();
    }

    public function detailExpense(string $expense_id): JsonResponse
    {
        return $this->expenseService->detailExpense((int) $expense_id);
    }

    public function createExpense(CreateExpensesDTO $createExpensesDTO): JsonResponse
    {
        return $this->expenseService->createExpense($createExpensesDTO);
    }

    public function editExpense(string $expense_id, UpdateExpensesDTO $updateExpensesDTO): JsonResponse
    {
        return $this->expenseService->editExpense((int) $expense_id, $updateExpensesDTO);
    }

    public function deleteExpense(string $expense_id): JsonResponse
    {
        return $this->expenseService->deleteExpense((int) $expense_id);
    }
}
