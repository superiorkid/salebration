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
import { OrderStatusEnum } from "@/enums/order-status";
import { PermissionsEnum } from "@/enums/permissions";
import {
  useDeleteReorder,
  useMarkReorderAsCancelMutation,
  useMarkReorderAsReceiveMutation,
} from "@/hooks/tanstack/reorder";
import { usePermission } from "@/hooks/use-permission";
import { cn, formatCurrency } from "@/lib/utils";
import { TReorder } from "@/types/reorder";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format, isBefore } from "date-fns";
import {
  AlertTriangleIcon,
  CheckIcon,
  EllipsisIcon,
  EyeIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReorderCancelledForm from "./_components/reorder-cancelled-form";

const statusFilterFn: FilterFn<TReorder> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export const reorderColumns: ColumnDef<TReorder>[] = [
  {
    accessorKey: "purchase_order_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO Number" />
    ),
    size: 120,
    cell: ({ row }) => {
      const { id, purchase_order_number } = row.original;
      return (
        <Link
          href={`/inventory/reorders/${id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {purchase_order_number}
        </Link>
      );
    },
  },
  {
    id: "product",
    accessorFn: (row) => row.product_variant.product.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const product = row.original.product_variant;
      return (
        <div className="min-w-[180px]">
          <div className="line-clamp-1 font-medium">{product.product.name}</div>
          <div className="text-muted-foreground text-sm">{product.value}</div>
        </div>
      );
    },
    size: 200,
    enableGlobalFilter: false,
  },
  {
    id: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    accessorFn: (row) => row.product_variant.product.supplier?.name,
    cell: ({ row }) => {
      const supplier = row.original.product_variant.product.supplier;
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
    size: 180,
    enableGlobalFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qty" />
    ),
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const stock = row.original.product_variant.quantity;
      return (
        <div className="flex items-center gap-2">
          <span>{quantity}</span>
          {stock < quantity && (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Order quantity exceeds current stock</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
    size: 80,
    enableGlobalFilter: false,
  },
  {
    id: "cost",
    accessorFn: (row) => row.quantity * row.cost_per_item,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost" />
    ),
    cell: ({ row }) => {
      const { quantity, cost_per_item } = row.original;
      return formatCurrency(quantity * cost_per_item);
    },
    size: 100,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return (
        <Tooltip>
          <TooltipTrigger>
            <div>{format(new Date(createdAt), "dd/MM/yy")}</div>
          </TooltipTrigger>
          <TooltipContent>{format(new Date(createdAt), "PPpp")}</TooltipContent>
        </Tooltip>
      );
    },
    size: 100,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "expected_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expected" />
    ),
    cell: ({ row }) => {
      const expectedAt = row.original.expected_at;
      return expectedAt ? (
        <Tooltip>
          <TooltipTrigger>
            <div
              className={cn(
                "text-red-500",
                isBefore(new Date(expectedAt), new Date()) &&
                  row.original.status === OrderStatusEnum.PENDING,
              )}
            >
              {format(new Date(expectedAt), "dd/MM/yy")}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {format(new Date(expectedAt), "PPpp")}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
    size: 100,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge className="capitalize">{status.toLowerCase()}</Badge>;
    },
    size: 120,
    filterFn: statusFilterFn,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;
      return <ActionRow reorderId={id} status={status} />;
    },
    enableSorting: false,
    size: 60,
    enableGlobalFilter: false,
  },
];

function ActionRow({
  reorderId,
  status,
}: {
  reorderId: number;
  status: OrderStatusEnum;
}) {
  const [openDropdown, openDropdownToggle] = useState<boolean>(false);

  const {
    isPending: markReorderAsReceivePending,
    markReorderAsReceiveMutation,
  } = useMarkReorderAsReceiveMutation({
    reorderId,
    onSuccess: () => {
      openDropdownToggle(false);
    },
  });

  const { markReorderAsCancelMutation, isPending: markReorderAsCancelPending } =
    useMarkReorderAsCancelMutation({
      reorderId,
      onSuccess: () => {
        openDropdownToggle(false);
      },
    });

  const { deleteReorderMutation, isPending: deleteReorderPending } =
    useDeleteReorder({
      onSucces: () => {
        openDropdownToggle(false);
      },
    });

  const canViewDetailReorder = usePermission(
    PermissionsEnum.DETAIL_REORDERS_PAGE,
  );
  const canMarkReorderAsReceive = usePermission(
    PermissionsEnum.RECEIVE_REORDERS,
  );
  const canMarkReorderAsCancelled = usePermission(
    PermissionsEnum.CANCEL_REORDERS,
  );
  const canDeleteReorder = usePermission(PermissionsEnum.DELETE_REORDERS);

  const hasAnyPermission =
    canViewDetailReorder ||
    canMarkReorderAsReceive ||
    canMarkReorderAsCancelled ||
    canDeleteReorder;

  return (
    <DropdownMenu open={openDropdown} onOpenChange={openDropdownToggle}>
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
        {canViewDetailReorder && (
          <DropdownMenuItem asChild>
            <Link href={`/inventory/reorders/${reorderId}`}>
              <EyeIcon strokeWidth={2} size={16} className="mr-1" />
              Detail
            </Link>
          </DropdownMenuItem>
        )}
        {status === OrderStatusEnum.ACCEPTED && canMarkReorderAsReceive && (
          <>
            {/* Mark as Received */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <CheckIcon strokeWidth={2} size={16} className="mr-1" />
                  Mark as Received
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Receipt of Order</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="text-muted-foreground text-sm">
                      This will mark the order as received in our system. Only
                      use this after:
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>You have physically received all items</li>
                        <li>
                          You&apos;ve verified the quantity matches the order
                        </li>
                        <li>The items meet quality standards</li>
                      </ul>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => markReorderAsReceiveMutation()}
                    disabled={markReorderAsReceivePending}
                  >
                    Confirm Receipt
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {status === OrderStatusEnum.PENDING && (
          <>
            {canMarkReorderAsCancelled && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <XIcon size={16} strokeWidth={2} className="mr-1" />
                    Mark as Cancelled
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel This Order</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="text-muted-foreground text-sm">
                        Use this option when:
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          <li>The supplier cannot fulfill the order</li>
                          <li>The order is no longer needed</li>
                          <li>
                            There are significant delays with no resolution
                          </li>
                        </ul>
                        Please provide a cancellation reason below.
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div>
                    <ReorderCancelledForm
                      isPending={markReorderAsCancelPending}
                      onCancelledHandler={markReorderAsCancelMutation}
                    />
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canDeleteReorder && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <TrashIcon strokeWidth={2} size={16} className="mr-1" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Permanently Delete Order
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="text-muted-foreground space-y-2 text-sm">
                        <div>
                          Warning: This will completely remove the order record
                          from the system.
                        </div>
                        <div>Only use this option for:</div>
                        <ul className="list-disc space-y-1 pl-5">
                          <li>Duplicate orders created by mistake</li>
                          <li>
                            Test orders that shouldn&apos;t be in production
                          </li>
                          <li>
                            Orders with fundamentally incorrect information
                          </li>
                        </ul>
                        <div className="font-semibold text-red-500">
                          For normal order processing, use &quot;Mark as
                          Cancelled&quot; instead.
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteReorderMutation(reorderId)}
                      disabled={deleteReorderPending}
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
