"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionsEnum } from "@/enums/permissions";
import { useDeleteSupplier } from "@/hooks/tanstack/supplier";
import { usePermission } from "@/hooks/use-permission";
import { cn } from "@/lib/utils";
import { TSupplier } from "@/types/supplier";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  EllipsisIcon,
  Loader2Icon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const statusFilterFn: FilterFn<TSupplier> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export const supplierColumns: ColumnDef<TSupplier>[] = [
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
    cell: ({ row }) => {
      const name = row.original.name;
      const imageUrl = row.original.profile_image;

      return (
        <div className="flex items-center gap-2">
          <div className="relative size-6 overflow-hidden rounded-full">
            <Image
              fill
              src={imageUrl || "https://picsum.photos/200"}
              alt={`${name} image`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone;
      return <div>{phone ?? "-"}</div>;
    },
  },
  {
    accessorKey: "address",
    enableSorting: false,
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const address = row.original.address;
      return <div className="max-w-[175px] truncate">{address ?? "-"}</div>;
    },
  },
  {
    accessorKey: "status",
    enableSorting: false,
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={cn(
            status === "inactive" &&
              "bg-muted-foreground/60 text-primary-foreground",
          )}
        >
          {status}
        </Badge>
      );
    },
    filterFn: statusFilterFn,
  },
  {
    accessorKey: "created_at",
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div>{format(new Date(createdAt), "dd/LL/yyyy")}</div>;
    },
  },
  {
    id: "Action",
    cell: ({ row }) => {
      const { id, name } = row.original;
      return <SupplierColumnAction supplierId={id} supplierName={name} />;
    },
  },
];

function SupplierColumnAction({
  supplierId,
  supplierName,
}: {
  supplierId: number;
  supplierName: string;
}) {
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);

  const { deleteSupplierMutation, isPending: deleteSupplierPending } =
    useDeleteSupplier({
      onSucces: () => {
        dropdownToggle(false);
      },
    });

  const canEditSupplier = usePermission(PermissionsEnum.EDIT_SUPPLIERS_PAGE);
  const canDeleteSupplier = usePermission(PermissionsEnum.DELETE_SUPPLIERS);
  const hasAnyPermission = canEditSupplier || canDeleteSupplier;

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownToggle}>
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
        <DropdownMenuSeparator />
        {canEditSupplier && (
          <DropdownMenuItem asChild>
            <Link href={`/inventory/suppliers/${supplierId}/edit`}>
              <SquarePenIcon strokeWidth={2} size={16} className="mr-1" />
              Edit Supplier
            </Link>
          </DropdownMenuItem>
        )}
        {canDeleteSupplier && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <TrashIcon size={16} strokeWidth={2} className="mr-2" />
                Delete Supplier
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this supplier?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove {supplierName} from your supplier
                  list. Any associated products will remain but will no longer
                  be linked to this supplier.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteSupplierPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteSupplierMutation(supplierId)}
                  disabled={deleteSupplierPending}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {deleteSupplierPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
