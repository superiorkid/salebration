"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionsEnum } from "@/enums/permissions";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import { TExpense } from "@/types/expense";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  EyeIcon,
  MoreHorizontal,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteExpenseDialog from "./delete-expense-dialog";

const categoryFilterFn: FilterFn<TExpense> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const category = row.getValue(columnId) as string;
  return filterValue.includes(category);
};

export const expenseColumns: ColumnDef<TExpense>[] = [
  {
    id: "no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    enableSorting: false,
  },
  {
    id: "category",
    accessorFn: (row) => row.category.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expense Category" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.category?.name || "Uncategorized"}
      </span>
    ),
    enableSorting: false,
    filterFn: categoryFilterFn,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      return <div className="font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "paid_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => format(new Date(row.original.paid_at), "MMM dd, yyyy"),
    sortingFn: "datetime",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.created_at), "MMM dd, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expenseId = row.original.id;
      return <ActionRow expenseId={expenseId} />;
    },
  },
];

function ActionRow({ expenseId }: { expenseId: number }) {
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);

  const canDeleteExpense = usePermission(PermissionsEnum.DELETE_EXPENSES);
  const canEditExpense = usePermission(PermissionsEnum.EDIT_EXPENSES_PAGE);
  const canViewDetailExpense = usePermission(
    PermissionsEnum.DETAIL_EXPENSES_PAGE,
  );

  const hasAnyPermission =
    canDeleteExpense || canEditExpense || canViewDetailExpense;

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownToggle}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={!hasAnyPermission}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canViewDetailExpense && (
          <DropdownMenuItem asChild>
            <Link href={`/finance/expenses/${expenseId}`}>
              <EyeIcon strokeWidth={2} size={16} className="mr-1" />
              Detail
            </Link>
          </DropdownMenuItem>
        )}
        {canEditExpense && (
          <DropdownMenuItem asChild>
            <Link href={`/finance/expenses/${expenseId}/edit`}>
              <SquarePenIcon strokeWidth={2} size={16} className="mr-1" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}
        {canDeleteExpense && (
          <DeleteExpenseDialog
            onSuccessAction={() => dropdownToggle(false)}
            expenseId={expenseId}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <TrashIcon size={16} strokeWidth={2} className="mr-1" />
              Delete
            </DropdownMenuItem>
          </DeleteExpenseDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
