import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PermissionsEnum } from "@/enums/permissions";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import { TPurchaseOrder } from "@/types/purchase-order";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, CopyIcon, EyeIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const statusFilterFn: FilterFn<TPurchaseOrder> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export const purchaseOrderColumns: ColumnDef<TPurchaseOrder>[] = [
  {
    accessorKey: "purchase_order_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO Number" />
    ),
    cell: ({ row }) => {
      const { id, purchase_order_number } = row.original;
      return (
        <PurchaseOrderNumberRow
          purchaseOrderId={id}
          purchaseOrderNumber={purchase_order_number}
        />
      );
    },
  },
  {
    id: "supplier",
    accessorFn: (row) => row.supplier.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return (
        <div>
          <div className="font-medium">{supplier?.name}</div>
          {supplier?.email && (
            <div className="text-muted-foreground truncate text-sm">
              {supplier.email}
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge>{status}</Badge>;
    },
    enableSorting: false,
    filterFn: statusFilterFn,
  },
  {
    id: "total_amount",
    accessorFn: (row) => {
      const purchaseOrderItems = row.purchase_order_items;
      return purchaseOrderItems.reduce((sum, item) => {
        return sum + item.quantity * item.unit_price;
      }, 0);
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const totalAmount = row.getValue("total_amount") as number;
      return <Label>{formatCurrency(totalAmount)}</Label>;
    },
  },
  {
    accessorKey: "expected_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expected Delivery" />
    ),
    cell: ({ row }) => {
      const expectedDate = row.original.expected_at;
      return expectedDate ? (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span>{format(new Date(expectedDate), "MMM dd, yyyy")}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">Not specified</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested On" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{format(date, "MMM dd, yyyy")}</span>
            </TooltipTrigger>
            <TooltipContent>{format(date, "PPpp")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, purchase_order_number } = row.original;
      return (
        <ActionRow
          purchaseOrderNumber={purchase_order_number}
          purhaseOrderId={id}
        />
      );
    },
  },
];

function PurchaseOrderNumberRow({
  purchaseOrderId,
  purchaseOrderNumber,
}: {
  purchaseOrderId: number;
  purchaseOrderNumber: string;
}) {
  const canViewDetailPurchaseOrder = usePermission(
    PermissionsEnum.DETAIL_PURCHASE_ORDERS_PAGE,
  );

  if (!canViewDetailPurchaseOrder) {
    return <Label>{purchaseOrderNumber}</Label>;
  }

  return (
    <Link
      href={`/inventory/purchase-orders/${purchaseOrderId}`}
      className="font-medium text-blue-600 hover:underline"
    >
      {purchaseOrderNumber}
    </Link>
  );
}

function ActionRow({
  purchaseOrderNumber,
  purhaseOrderId,
}: {
  purhaseOrderId: number;
  purchaseOrderNumber: string;
}) {
  const canViewDetailPurchaseOrder = usePermission(
    PermissionsEnum.DETAIL_PURCHASE_ORDERS_PAGE,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(purchaseOrderNumber)}
        >
          <CopyIcon size={16} strokeWidth={2} className="mr-1" />
          Copy PO Number
        </DropdownMenuItem>
        {canViewDetailPurchaseOrder && (
          <DropdownMenuItem asChild>
            <Link href={`/inventory/purchase-orders/${purhaseOrderId}`}>
              <EyeIcon size={16} strokeWidth={2} className="mr-1" />
              View Details
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
