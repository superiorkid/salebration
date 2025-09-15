"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteExpense } from "@/hooks/tanstack/expense";
import React, { useState } from "react";

interface DeleteExpenseDialogProps {
  children: React.ReactNode;
  expenseId: number;
  onSuccessAction?: () => void;
}

const DeleteExpenseDialog = ({
  children,
  onSuccessAction,
  expenseId,
}: DeleteExpenseDialogProps) => {
  const [dialogOpen, dialogToggle] = useState<boolean>(false);

  const { deleteExpenseMutation, isPending } = useDeleteExpense({
    onSucces: () => {
      onSuccessAction?.();
      dialogToggle(false);
    },
  });

  return (
    <AlertDialog open={dialogOpen} onOpenChange={dialogToggle}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this expense record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The expense will be permanently
            removed from your records. Any associated reports or analytics will
            be updated accordingly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => deleteExpenseMutation(expenseId)}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Expense"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteExpenseDialog;
