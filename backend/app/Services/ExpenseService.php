<?php

namespace App\Services;

use App\DTO\CreateExpensesDTO;
use App\DTO\UpdateExpensesDTO;
use App\Interfaces\ExpenseRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ExpenseService
{
    protected ExpenseRepositoryInterface $expenseRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        ExpenseRepositoryInterface $expenseRepositoryInterface
    )
    {
        $this->expenseRepositoryInterface = $expenseRepositoryInterface;
    }

    public function expenses(): JsonResponse
    {
        try {
            $expenses = $this->expenseRepositoryInterface->findMany();
            return response()->json([
                "success" => true,
                "message" => "Expenses retrieved successfully.",
                "data" => $expenses
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detailExpense(int $expense_id): JsonResponse
    {
        try {
            $expense = $this->expenseRepositoryInterface->findOneById($expense_id);
            if (empty($expense)) {
                return response()->json([
                    "success" => false,
                    "message" => "Expense not found.",
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "message" => "Expense retrieved successfully.",
                "data" => $expense
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createExpense(CreateExpensesDTO $createExpensesDTO): JsonResponse
    {
        try {
            DB::beginTransaction();

            $expense = $this->expenseRepositoryInterface->create($createExpensesDTO);

            if (filled($createExpensesDTO->images)) {
               $expense->uploadImages($createExpensesDTO->images, "expenses");
            }

            // TODO: add activity logs

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Expense added successfully.",
            ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function editExpense(int $expense_id, UpdateExpensesDTO $updateExpensesDTO): JsonResponse
    {
        $expense = $this->expenseRepositoryInterface->findOneById($expense_id);
        if (empty($expense)) {
            return response()->json([
                "success" => false,
                "message" => "Expense not found.",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();

            $this->expenseRepositoryInterface->update($expense, $updateExpensesDTO);

            // handle media updates
            if (filled($updateExpensesDTO->delete_images)){
                $expense->media()
                    ->whereIn("id", $updateExpensesDTO->delete_images)
                    ->delete();
            }

            if (filled($updateExpensesDTO->new_images)){
                foreach ($updateExpensesDTO->new_images as $image){
                    $expense->uploadImage(
                        image: $image,
                        collection: "expenses"
                    );
                }
            }

            // TODO: activity log

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Expense updated successfully.",
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteExpense(int $expense_id): JsonResponse
    {
        $expense = $this->expenseRepositoryInterface->findOneById($expense_id);
        if (empty($expense)) {
            return response()->json([
                "success" => false,
                "message" => "Expense not found.",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->expenseRepositoryInterface->delete($expense);
            return response()->json([
                "success" => true,
                "message" => "Expense deleted successfully.",
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
