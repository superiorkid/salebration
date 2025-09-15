"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import ExpenseCategoryForm from "./expense-category-form";

const AddExpenseCategoryDialog = () => {
  const [openDialog, openDialogToggle] = useState<boolean>(false);

  return (
    <Dialog open={openDialog} onOpenChange={openDialogToggle}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1 text-sm font-semibold"
        >
          <PlusIcon size={14} strokeWidth={2} />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Expense Category</DialogTitle>
          <DialogDescription>
            Organize expenses by creating clear categories for better budgeting
            and reporting.
          </DialogDescription>
        </DialogHeader>
        <ExpenseCategoryForm
          onSubmitSuccess={() => {
            openDialogToggle(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseCategoryDialog;
