"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PermissionsEnum } from "@/enums/permissions";
import { usePermission } from "@/hooks/use-permission";
import { cn, formatCurrency } from "@/lib/utils";
import { TProductVariant } from "@/types/product-variant";
import { TReorder } from "@/types/reorder";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import {
  AlertTriangleIcon,
  EllipsisIcon,
  GalleryVerticalEndIcon,
  TextSearchIcon,
  TimerResetIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const supplierFilterFn: FilterFn<TProductVariant> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const supplier = row.getValue(columnId) as string;
  return filterValue.includes(supplier);
};

export const stockManagementColumns: ColumnDef<TProductVariant>[] = [
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
    id: "sku",
    accessorFn: (row) => row.product.sku + row.sku_suffix,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => {
      const { sku } = row.original.product;
      const suffix = row.original.sku_suffix;
      const quantity = row.original.quantity;
      const minStock = row.original.min_stock_level;
      const isLow = quantity <= minStock;

      return (
        <div className="flex items-center gap-2">
          {isLow && (
            <div className="size-2 rounded-full bg-red-500" title="Low stock" />
          )}
          <div>
            <span className="font-semibold">{sku}</span>
            <span className="text-muted-foreground">{suffix}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "productName",
    accessorFn: (row) => row.product.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const { name, image } = row.original.product;
      return (
        <div className="flex items-center gap-2">
          <div className="relative size-8">
            <Image
              fill
              src={image}
              alt={name}
              className="rounded border object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <span className="max-w-[150px] truncate">{name}</span>
        </div>
      );
    },
  },
  {
    id: "variant",
    accessorFn: (row) => `${row.attribute}: ${row.value}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.attribute}:{" "}
        <span className="font-medium">{row.original.value}</span>
      </span>
    ),
  },
  {
    id: "barcode",
    accessorFn: (row) => row.barcode,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Barcode" />
    ),
    cell: ({ row }) =>
      row.original.barcode ? (
        <span className="font-mono">{row.original.barcode}</span>
      ) : (
        <span className="text-muted-foreground italic">No Barcode</span>
      ),
  },
  {
    id: "basePrice",
    accessorFn: (row) => row.product.base_price,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Base Price" />
    ),
    cell: ({ row }) => {
      const basePrice = row.original.product.base_price ?? 0;
      return <span>{formatCurrency(basePrice)}</span>;
    },
  },
  {
    id: "totalPrice",
    accessorFn: (row) => row.selling_price,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selling Price" />
    ),
    cell: ({ row }) => {
      const { selling_price, additional_price, product } = row.original;
      const basePrice = product.base_price ?? 0;
      const expectedSellingPrice = basePrice + additional_price;
      const matches = expectedSellingPrice === selling_price;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{formatCurrency(selling_price)}</span>

          {matches ? (
            <span className="text-muted-foreground font-mono text-xs">
              = {formatCurrency(basePrice)} + {formatCurrency(additional_price)}
            </span>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangleIcon className="h-3 w-3" />
                  <span className="font-medium">Manual price</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Base: {formatCurrency(basePrice)} + Additional:{" "}
                  {formatCurrency(additional_price)} <br />≠ Selling:{" "}
                  {formatCurrency(selling_price)}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    id: "stock",
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const { quantity, min_stock_level } = row.original;
      const isLow = quantity <= min_stock_level;
      return (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-medium",
              isLow ? "text-rose-500" : "text-emerald-500",
            )}
          >
            {quantity} Unit
          </span>
          <span className="text-muted-foreground text-xs">
            Min: {min_stock_level}
          </span>
        </div>
      );
    },
  },
  {
    id: "supplier",
    accessorFn: (row) => row.product.supplier?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    filterFn: supplierFilterFn,
    cell: ({ row }) => {
      const supplier = row.original.product.supplier;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={supplier?.profile_image ?? ""} />
            <AvatarFallback>
              {supplier?.name?.slice(0, 2).toUpperCase() ?? "NA"}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[108px] truncate text-sm">
            {supplier?.name ?? "Unknown"}
          </span>
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => (
      <RowAction id={row.original.id} reorders={row.original.reorders} />
    ),
  },
];
function RowAction({ id, reorders }: { id: number; reorders: TReorder[] }) {
  const canViewReorders = usePermission(PermissionsEnum.VIEW_REORDERS_PAGE);
  const canViewStockAudit = usePermission(
    PermissionsEnum.VIEW_STOCK_AUDIT_PAGE,
  );
  const canViewStockHistories = usePermission(
    PermissionsEnum.VIEW_STOCK_HISTORIES,
  );

  const hasActiveReorder = reorders?.some(
    (reorder) => reorder.status === "pending" || reorder.status === "accepted",
  );

  const hasAnyPermission =
    canViewReorders || canViewStockAudit || canViewStockHistories;
  const showReorder = !hasActiveReorder && canViewReorders;

  return (
    <DropdownMenu>
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
        {showReorder && (
          <DropdownMenuItem asChild>
            <Link href={`/inventory/stock-managements/reorder?variantId=${id}`}>
              <TimerResetIcon strokeWidth={2} size={16} className="mr-1" />
              Reorder
            </Link>
          </DropdownMenuItem>
        )}
        {canViewStockAudit && (
          <DropdownMenuItem asChild>
            <Link href={`/inventory/stock-managements/${id}/audit`}>
              <TextSearchIcon strokeWidth={2} size={16} className="mr-1" />
              Audit Stock
            </Link>
          </DropdownMenuItem>
        )}

        {canViewStockHistories && (
          <DropdownMenuItem asChild>
            <Link href={`/inventory/stock-managements/${id}/history`}>
              <GalleryVerticalEndIcon
                strokeWidth={2}
                size={16}
                className="mr-1"
              />
              Stock History
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
