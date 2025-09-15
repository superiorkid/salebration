"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction, useState } from "react";
import CategoryForm from "./category-form";

interface CategoryDialogProps {
  children: React.ReactNode;
  categoryId?: number;
  dropdownToggle?: Dispatch<SetStateAction<boolean>>;
}

const CategoryDialog = ({
  children,
  categoryId,
  dropdownToggle,
}: CategoryDialogProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="min-w-[540px] sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {categoryId ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {categoryId
              ? "Update your product category details below"
              : "Organize your inventory by creating new product categories"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <CategoryForm
            dialogToggle={setOpenDialog}
            categoryId={categoryId}
            dropdownToggle={dropdownToggle}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CategoryDialog;
