"use client";

import { useExpenseCategories } from "@/hooks/tanstack/expense-categories";
import ExpenseCategoriesDataTable from "./expense-categories-data-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { expenseCategoryColumns } from "./expense-categories-columns";

const ExpenseCategoriesTable = () => {
  const { error, expenseCategories, isError, isPending } =
    useExpenseCategories();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch expense categories data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ExpenseCategoriesDataTable
      columns={expenseCategoryColumns}
      data={expenseCategories?.data || []}
    />
  );
};

export default ExpenseCategoriesTable;
