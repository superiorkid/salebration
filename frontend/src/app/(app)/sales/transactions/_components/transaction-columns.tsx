"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
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
import { Label } from "@/components/ui/label";
import { PermissionsEnum } from "@/enums/permissions";
import { TransactionStatusEnum } from "@/enums/transaction-status";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import { TSale } from "@/types/sale";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isEqual,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import { CopyIcon, EllipsisIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import RefundAlert from "./refund-alert";

const statusFilterFn: FilterFn<TSale> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

const paymentMethodFilterFn: FilterFn<TSale> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue.length) return true;
  const paymentMethod = row.getValue(columnId) as string;
  return filterValue.includes(paymentMethod);
};

const dateRangeFilterFn: FilterFn<TSale> = (
  row,
  columnId,
  filterValue: [Date | undefined, Date | undefined] | undefined,
) => {
  if (!filterValue || (!filterValue[0] && !filterValue[1])) return true;

  const cellValue = row.getValue(columnId);
  const rowDate = parseISO(cellValue as string);

  const [fromDate, toDate] = filterValue;

  if (fromDate && toDate) {
    const start = startOfDay(fromDate);
    const end = endOfDay(toDate);
    return isWithinInterval(rowDate, { start, end });
  }

  if (fromDate) {
    return (
      isAfter(rowDate, startOfDay(fromDate)) ||
      isEqual(rowDate, startOfDay(fromDate))
    );
  }

  if (toDate) {
    return (
      isBefore(rowDate, endOfDay(toDate)) || isEqual(rowDate, endOfDay(toDate))
    );
  }

  return true;
};

export const transactionColumns: ColumnDef<TSale>[] = [
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const createdAt = format(
        new Date(row.original.created_at),
        "dd/LL/yyyy HH:mm",
      );
      return <Label>{createdAt}</Label>;
    },
    filterFn: dateRangeFilterFn,
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const total = formatCurrency(row.original.total);
      return <Label>{total}</Label>;
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      const paid = formatCurrency(row.original.paid);
      return <Label>{paid}</Label>;
    },
  },
  {
    accessorKey: "change",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Change" />
    ),
    cell: ({ row }) => {
      const change = formatCurrency(row.original.change);
      return <Label>{change}</Label>;
    },
  },
  {
    id: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => {
      const method = row.original.payments.at(0)?.method;
      return <Label>{method}</Label>;
    },
    accessorFn: (row) => row.payments.at(0)?.method,
    filterFn: paymentMethodFilterFn,
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
    id: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => {
      const itemsLength = row.original.items.length;
      return <Label>{itemsLength}</Label>;
    },
  },
  {
    id: "cashier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cashier" />
    ),
    cell: ({ row }) => {
      const cashierName = row.original.operator.name;
      return <Label>{cashierName}</Label>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { id, total, items, status, invoice } = row.original;
      return (
        <ActionRow
          transactionId={id}
          total={total}
          itemsLength={items.length}
          status={status}
          invoice={invoice.number}
        />
      );
    },
  },
];

function ActionRow({
  transactionId,
  itemsLength,
  total,
  status,
  invoice,
}: {
  transactionId: number;
  itemsLength: number;
  total: number;
  status: TransactionStatusEnum;
  invoice: string;
}) {
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);

  const canViewTransactionDetail = usePermission(
    PermissionsEnum.DETAIL_TRANSACTIONS_PAGE,
  );
  const canRefundTransaction = usePermission(PermissionsEnum.PROCESS_REFUNDS);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownToggle}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-5">
          <EllipsisIcon strokeWidth={2} size={16} />
          <span className="sr-only">More Action</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(invoice)}
        >
          <CopyIcon strokeWidth={2} size={16} className="mr-1" />
          Copy Invoice
        </DropdownMenuItem>
        {canViewTransactionDetail && (
          <DropdownMenuItem asChild>
            <Link href={`/sales/transactions/${transactionId}`}>
              <EyeIcon strokeWidth={2} size={16} className="mr-1" />
              View
            </Link>
          </DropdownMenuItem>
        )}
        {status !== TransactionStatusEnum.REFUNDED && canRefundTransaction && (
          <RefundAlert
            itemsLength={itemsLength}
            total={total}
            transactionId={transactionId}
            onRefundSuccess={() => {
              dropdownToggle(false);
            }}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
