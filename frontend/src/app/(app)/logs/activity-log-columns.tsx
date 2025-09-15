"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TActivityLog } from "@/types/activity-log";
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

const actionFilterFn: FilterFn<TActivityLog> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const action = row.getValue(columnId) as string;
  return filterValue.includes(action);
};

const dateRangeFilterFn: FilterFn<TActivityLog> = (
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

export const activityLogColumns: ColumnDef<TActivityLog>[] = [
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
    id: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return <Label>{user?.name}</Label>;
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    enableSorting: false,
    filterFn: actionFilterFn,
  },
  {
    accessorKey: "subject_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject Type" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "subject_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject Id" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div>{format(new Date(createdAt), "dd/LL/yyyy HH:mm")}</div>;
    },
    filterFn: dateRangeFilterFn,
  },
];
