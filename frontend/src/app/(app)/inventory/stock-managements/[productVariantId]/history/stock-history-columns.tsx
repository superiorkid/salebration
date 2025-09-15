"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { TStockHistory } from "@/types/stock-history";
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

const typeFilterFn: FilterFn<TStockHistory> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const type = row.getValue(columnId) as string;
  return filterValue.includes(type);
};

const dateRangeFilterFn: FilterFn<TStockHistory> = (
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

export const stockHistoryColumns: ColumnDef<TStockHistory>[] = [
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return format(new Date(date), "dd/LL/yyyy HH:mm");
    },
    filterFn: dateRangeFilterFn,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const type = row.original.type;
      return <Badge>{type}</Badge>;
    },
    filterFn: typeFilterFn,
  },
  {
    accessorKey: "quantity_before",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Before" />
    ),
  },
  {
    accessorKey: "quantity_change",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Change" />
    ),
    cell: ({ row }) => {
      const change = row.getValue("quantity_change") as number;
      return change > 0 ? `+${change}` : change;
    },
  },
  {
    accessorKey: "quantity_after",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="After" />
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string;
      return notes || "-";
    },
  },
  {
    id: "performed_by",
    accessorFn: (row) => row.performed_by.name,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Performed by" />
    ),
  },
];
