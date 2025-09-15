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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useDeleteProduct } from "@/hooks/tanstack/product";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import { TProduct } from "@/types/product";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisIcon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const statusFilterFn: FilterFn<TProduct> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

const categoryFilterFn: FilterFn<TProduct> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const category = row.getValue(columnId) as string;
  return filterValue.includes(category);
};

export const productColumns: ColumnDef<TProduct>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          {...{
            className: "size-7 text-muted-foreground",
            onClick: row.getToggleExpandedHandler(),
            "aria-expanded": row.getIsExpanded(),
            "aria-label": row.getIsExpanded()
              ? `Collapse details for ${row.original.name}`
              : `Expand details for ${row.original.name}`,
            size: "icon",
            variant: "ghost",
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronUpIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>
      ) : undefined;
    },
  },
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
    accessorKey: "sku",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => {
      const sku = row.original.sku;
      return <div className="font-semibold">{sku}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const { name, image, status } = row.original;
      return (
        <div className="relative flex max-w-[200px] items-center gap-3 truncate">
          <div className="relative size-8">
            <Image
              fill
              src={image}
              alt={name}
              className="rounded border object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-medium">{name}</span>
            {status === "inactive" && (
              <span className="text-muted-foreground text-xs italic">
                Inactive
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "category",
    accessorFn: (row) => row.category?.name,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const category = row.original.category;
      return <Badge>{category?.name}</Badge>;
    },
    filterFn: categoryFilterFn,
  },
  {
    accessorKey: "supplier",
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage
              src={supplier?.profile_image || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="max-w-[90px] truncate text-sm tracking-tight 2xl:max-w-max">
            {supplier?.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "base_price",
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Base Price" />
    ),
    cell: ({ row }) => {
      const basePrice = row.original.base_price;
      return formatCurrency(Number(basePrice));
    },
  },
  {
    accessorKey: "status",
    enableGlobalFilter: false,
    enableSorting: false,
    enableHiding: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "active" ? "outline" : "secondary"}>
          {status === "active" ? "Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: statusFilterFn,
  },
  {
    id: "variants",
    enableGlobalFilter: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variants" />
    ),
    cell: ({ row }) => {
      const variants = row.original.variants;
      const lowStock = variants.filter(
        (v) => v.quantity <= v.min_stock_level,
      ).length;

      return (
        <div className="text-sm">
          {variants.length} item{variants.length !== 1 ? "s" : ""}
          {lowStock > 0 && (
            <span className="ml-2 rounded bg-rose-100 px-1.5 py-0.5 text-xs text-rose-600">
              {lowStock} low stock
            </span>
          )}
        </div>
      );
    },
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
      return <ProductColumnAction productId={id} productName={name} />;
    },
  },
];

function ProductColumnAction({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const [dialogOpen, dialogToggle] = useState<boolean>(false);
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);

  const { deleteProductMutation, isPending: deleteProductPending } =
    useDeleteProduct({
      onSuccess: () => {
        dialogToggle(false);
        dropdownToggle(false);
      },
    });

  const canEditProduct = usePermission(PermissionsEnum.EDIT_PRODUCTS_PAGE);
  const canDeleteProduct = usePermission(PermissionsEnum.DELETE_PRODUCTS);
  const hasAnyPermission = canEditProduct || canDeleteProduct;

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownToggle}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5"
          disabled={!hasAnyPermission}
        >
          <EllipsisIcon />
          <span className="sr-only">More Action</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canEditProduct && (
          <DropdownMenuItem asChild>
            <Link href={`/inventory/products/${productId}/edit`}>
              <SquarePenIcon strokeWidth={2} size={16} className="mr-1" />
              Edit Product
            </Link>
          </DropdownMenuItem>
        )}
        {canDeleteProduct && (
          <AlertDialog open={dialogOpen} onOpenChange={dialogToggle}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <TrashIcon size={16} strokeWidth={2} className="mr-1" />
                Delete Product
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this product permanently?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove &quot;{productName}&quot; and all its
                  variants from your catalog. Any associated inventory records
                  will be deleted. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteProductPending}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  disabled={deleteProductPending}
                  onClick={() => deleteProductMutation(productId)}
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
