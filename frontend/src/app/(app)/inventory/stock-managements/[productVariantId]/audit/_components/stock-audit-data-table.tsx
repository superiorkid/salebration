"use client";

import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionsEnum } from "@/enums/permissions";
import { usePermission } from "@/hooks/use-permission";
import { cn } from "@/lib/utils";
import { TStockAudit } from "@/types/stock-audit";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface StockAuditDataTableProps {
  columns: ColumnDef<TStockAudit>[];
  data: TStockAudit[];
}

const StockAuditDataTable = ({ columns, data }: StockAuditDataTableProps) => {
  const { productVariantId } = useParams<{ productVariantId: string }>();

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "created_at",
          desc: true,
        },
      ],
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const canAddAudit = usePermission(PermissionsEnum.ADD_STOCK_AUDIT_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          {canAddAudit && (
            <Link
              href={`/inventory/stock-managements/${productVariantId}/audit/add`}
              className={cn(
                buttonVariants({
                  className: "h-8 text-sm font-semibold",
                  size: "sm",
                  variant: "outline",
                }),
              )}
            >
              <PlusIcon size={14} strokeWidth={2} className="mr-1" />
              Add
            </Link>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default StockAuditDataTable;
