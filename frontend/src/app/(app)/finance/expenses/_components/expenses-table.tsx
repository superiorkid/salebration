"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useExpenses } from "@/hooks/tanstack/expense";
import { AlertCircleIcon } from "lucide-react";
import { expenseColumns } from "./expenses-columns";
import ExpensesDataTable from "./expenses-data-table";

const ExpensesTable = () => {
  const { error, expenses, isError, isPending } = useExpenses();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch expenses data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ExpensesDataTable columns={expenseColumns} data={expenses?.data || []} />
  );
};

export default ExpensesTable;
