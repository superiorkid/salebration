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
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionsEnum } from "@/enums/permissions";
import { useDeleteCustomer } from "@/hooks/tanstack/customer";
import { usePermission } from "@/hooks/use-permission";
import { cn } from "@/lib/utils";
import { TCustomer } from "@/types/customer";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { EllipsisIcon, PenBoxIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const customerColumns: ColumnDef<TCustomer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const companyName = row.original.company_name;
      return <div>{companyName ?? "-"}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone;
      return <div>{phone ?? "-"}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      return <div>{email ?? "-"}</div>;
    },
  },
  {
    id: "last_purchase",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Purchase" />
    ),
    accessorFn: (row) => row.sales.at(0)?.created_at,
    cell: ({ row }) => {
      const lastPurchases = row.original.sales;
      return (
        <div>
          {formatDistanceToNow(
            new Date(lastPurchases[lastPurchases.length - 1].created_at),
            { addSuffix: true, includeSeconds: true },
          )}
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const id = row.original.id;
      return <RowAction customerId={id} />;
    },
  },
];

function RowAction({ customerId }: { customerId: number }) {
  const [dropdownOpen, dropdownOpenToggle] = useState<boolean>(false);
  const [dialogOpen, dialogToggle] = useState<boolean>(false);

  const { deleteCustomerMutation, isPending } = useDeleteCustomer({
    onSucces: () => {
      dialogToggle(false);
      dropdownOpenToggle(false);
    },
  });

  const canEditCustomer = usePermission(PermissionsEnum.EDIT_CUSTOMERS_PAGE);
  const canDeleteCustomer = usePermission(PermissionsEnum.DELETE_CUSTOMERS);
  const hasAnyPermission = canEditCustomer || canDeleteCustomer;

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownOpenToggle}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5"
          disabled={!hasAnyPermission}
        >
          <EllipsisIcon strokeWidth={2} size={16} />
          <span className="sr-only">More Action</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {canEditCustomer && (
          <DropdownMenuItem asChild>
            <Link
              href={`/customers/${customerId}/edit`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <PenBoxIcon size={14} strokeWidth={2} className="mr-1" />
              Edit Customer
            </Link>
          </DropdownMenuItem>
        )}
        {canDeleteCustomer && (
          <AlertDialog open={dialogOpen} onOpenChange={dialogToggle}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <TrashIcon size={16} strokeWidth={2} className="mr-1" />
                Delete Customer
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete customer record?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this customer&apos;s profile and
                  all associated data. Any transaction history linked to this
                  customer will remain intact.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={() => deleteCustomerMutation(customerId)}
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
