"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { usePermission } from "@/hooks/use-permission";
import Link from "next/link";
import DeleteExpenseDialog from "../../_components/delete-expense-dialog";

interface ExpenseActionButtonsProps {
  expenseId: number;
}

const ExpenseActionButtons = ({ expenseId }: ExpenseActionButtonsProps) => {
  const canEditExpense = usePermission(PermissionsEnum.EDIT_EXPENSES_PAGE);
  const canDeleteExpense = usePermission(PermissionsEnum.DELETE_EXPENSES);

  return (
    <div className="flex gap-2">
      {canEditExpense && (
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/finance/expenses/${expenseId}/edit`}
        >
          Edit Expense
        </Link>
      )}
      {canDeleteExpense && (
        <DeleteExpenseDialog expenseId={Number(expenseId)}>
          <Button
            variant="destructive"
            size="sm"
            className="hover:cursor-pointer"
          >
            Delete
          </Button>
        </DeleteExpenseDialog>
      )}
    </div>
  );
};

export default ExpenseActionButtons;
