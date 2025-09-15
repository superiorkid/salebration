<?php

namespace App\Observers;

use App\Models\Expense;

class ExpenseObserver
{
    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Expense $expense): void
    {
        $expense->clearMediaCollection('expenses');
    }
}
