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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PermissionsEnum } from "@/enums/permissions";
import { useDeleteStockAudit } from "@/hooks/tanstack/stock-audit";
import { usePermission } from "@/hooks/use-permission";
import { TStockAudit } from "@/types/stock-audit";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import { useState } from "react";

export const stockAuditColumns: ColumnDef<TStockAudit>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Audit Date" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div>{format(new Date(createdAt), "dd/LL/yyyy HH:mm")}</div>;
    },
  },
  {
    id: "auditorName",
    accessorFn: (row) => row.auditor.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Audit By" />
    ),
    cell: ({ row }) => row.original.auditor?.name || "System",
  },
  {
    id: "product_name",
    accessorFn: (row) => {
      return `${row.product_variant.product.name} ${row.product_variant.value}`;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.product_variant.product.name}
        <span className="text-muted-foreground ml-1">
          ({row.original.product_variant.value})
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "system_quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="System Qty" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "counted_quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Counted Qty" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "difference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diff" />
    ),
    cell: ({ row }) => (
      <span
        className={
          row.original.difference > 0
            ? "text-green-600"
            : row.original.difference < 0
              ? "text-red-600"
              : ""
        }
      >
        {row.original.difference > 0 ? "+" : ""}
        {row.original.difference}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex max-w-[200px] items-center truncate rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {row.original.notes ? "View Notes" : "-"}
          </span>
        </TooltipTrigger>
        {row.original.notes && (
          <TooltipContent className="max-w-[300px]">
            <p className="text-sm">{row.original.notes}</p>
          </TooltipContent>
        )}
      </Tooltip>
    ),
  },
  {
    id: "action",
    cell: ({ row }) => {
      const id = row.original.id;
      return <RowAction stockAuditId={id} />;
    },
  },
];

function RowAction({ stockAuditId }: { stockAuditId: number }) {
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);
  const [dialogOpen, dialogToggle] = useState<boolean>(false);

  const { deleteStockAuditMutation, isPending } = useDeleteStockAudit({
    onSucces: () => {
      dialogToggle(false);
      dropdownToggle(false);
    },
  });

  const canDeleteAudit = usePermission(PermissionsEnum.DELETE_STOCK_AUDITS);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownToggle}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={!canDeleteAudit}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {canDeleteAudit && (
          <AlertDialog open={dialogOpen} onOpenChange={dialogToggle}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <TrashIcon size={16} strokeWidth={2} className="mr-1" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  disabled={isPending}
                  onClick={() => deleteStockAuditMutation(stockAuditId)}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
