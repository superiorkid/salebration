"use client";

import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionsEnum } from "@/enums/permissions";
import { useDebounce } from "@/hooks/use-debounce";
import { usePermission } from "@/hooks/use-permission";
import { cn } from "@/lib/utils";
import { TExpense } from "@/types/expense";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FilterIcon, ListFilterIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ExpensesDataTableProps {
  columns: ColumnDef<TExpense>[];
  data: TExpense[];
}

const ExpensesDataTable = ({ columns, data }: ExpensesDataTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilter = useDebounce(columnFilters, 500);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters: debouncedColumnFilter,
    },
    onColumnFiltersChange: setColumnFilters,
  });

  const canAddExpense = usePermission(PermissionsEnum.ADD_EXPENSES_PAGE);

  const uniqueCategoryValues = useMemo(() => {
    const categoryColumn = table.getColumn("category");

    if (!categoryColumn) return [];

    const values = Array.from(categoryColumn.getFacetedUniqueValues().keys());

    return values.sort();
  }, [table.getColumn("category")?.getFacetedUniqueValues()]);

  const categoryCounts = useMemo(() => {
    const categoryColumn = table.getColumn("category");
    if (!categoryColumn) return new Map();
    return categoryColumn.getFacetedUniqueValues();
  }, [table.getColumn("category")?.getFacetedUniqueValues()]);

  const selectedCategories = useMemo(() => {
    const filterValue = table
      .getColumn("category")
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("category")?.getFilterValue()]);

  const handleCategoryChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("category")
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("category")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              className="peer h-8 w-[249px] ps-9"
              placeholder="Search by title..."
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Category
                {selectedCategories.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {uniqueCategoryValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${i}`}
                        checked={selectedCategories.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleCategoryChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {categoryCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          {canAddExpense && (
            <Link
              href="/finance/expenses/add"
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

export default ExpensesDataTable;
