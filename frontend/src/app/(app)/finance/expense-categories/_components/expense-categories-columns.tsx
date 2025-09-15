"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionsEnum } from "@/enums/permissions";
import { useDeleteExpenseCategory } from "@/hooks/tanstack/expense-categories";
import { usePermission } from "@/hooks/use-permission";
import { TExpenseCategory } from "@/types/expense-category";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const expenseCategoryColumns: ColumnDef<TExpenseCategory>[] = [
  {
    id: "id",
    size: 28,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div>{format(new Date(createdAt), "dd/LL/yyyy")}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at;
      return <div>{format(new Date(updatedAt), "dd/LL/yyyy")}</div>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const id = row.original.id;
      return <ActionRow expenseCategoryId={id} />;
    },
  },
];

function ActionRow({ expenseCategoryId }: { expenseCategoryId: number }) {
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);
  const [dialogOpen, dialogToggle] = useState<boolean>(false);

  const { deleteSupplierMutation, isPending } = useDeleteExpenseCategory({
    onSucces: () => {
      dropdownToggle(false);
      dialogToggle(false);
    },
  });

  const canDeleteExpenseCategory = usePermission(
    PermissionsEnum.DELETE_EXPENSES_CATEGORY,
  );

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownToggle}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5"
          disabled={!canDeleteExpenseCategory}
        >
          <EllipsisIcon strokeWidth={2} size={16} />
          <span className="sr-only">More Action</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canDeleteExpenseCategory && (
          <AlertDialog open={dialogOpen} onOpenChange={dialogToggle}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <TrashIcon size={16} strokeWidth={2} className="mr-1" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this expense category?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All expenses under this category
                  will remain but will no longer be associated with this
                  category. Consider updating affected expenses before deletion.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={() => deleteSupplierMutation(expenseCategoryId)}
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete Category"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
