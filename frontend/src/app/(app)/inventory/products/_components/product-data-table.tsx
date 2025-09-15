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
import { cn, formatCurrency } from "@/lib/utils";
import { TProduct } from "@/types/product";
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  FilterIcon,
  InfoIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";

interface ProductDataTableProps {
  columns: ColumnDef<TProduct>[];
  data: TProduct[];
}

export function ProductDataTable({ columns, data }: ProductDataTableProps) {
  const canAddProduct = usePermission(PermissionsEnum.ADD_PRODUCTS_PAGE);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    status: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowCanExpand: (row) => row.original.variants.length > 0,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      expanded,
      globalFilter: debouncedGlobalFilter,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
  });

  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return [];
    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
    return values.sort();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("status")?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
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
      .getColumn("status")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

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
              className="peer h-8 w-[269px] ps-9"
              placeholder="Search by name and SKU..."
              type="search"
              value={globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Status
                {selectedStatuses.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedStatuses.length}
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
                  {uniqueStatusValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${i}`}
                        checked={selectedStatuses.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleStatusChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {statusCounts.get(value)}
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
          {table.getSelectedRowModel().rows.length > 0 && (
            <Button
              className="ml-auto h-8 border-rose-400 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
              variant="outline"
            >
              <TrashIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Delete
              <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                {table.getSelectedRowModel().rows.length}
              </span>
            </Button>
          )}
          <DataTableViewOptions table={table} />
          {canAddProduct && (
            <Link
              href="/inventory/products/add"
              className={cn(
                buttonVariants({
                  className: "text-sm font-semibold",
                  variant: "outline",
                  size: "sm",
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
                <Fragment key={row.id}>
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
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="text-primary/80 flex items-start py-2">
                          <span
                            className="me-3 mt-0.5 flex w-7 shrink-0 justify-center"
                            aria-hidden="true"
                          >
                            <InfoIcon className="opacity-60" size={16} />
                          </span>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Attribute</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Barcode</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Min Stock</TableHead>
                                <TableHead>Additional Price</TableHead>
                                <TableHead>Selling Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.original.variants.map((variant, index) => {
                                const isLow =
                                  variant.quantity <= variant.min_stock_level;
                                const expectedPrice =
                                  (row.original.base_price ?? 0) +
                                  variant.additional_price;

                                return (
                                  <TableRow key={index}>
                                    <TableCell>
                                      {row.original.sku + variant.sku_suffix}
                                    </TableCell>
                                    <TableCell>{variant.attribute}</TableCell>
                                    <TableCell>{variant.value}</TableCell>
                                    <TableCell>
                                      {variant.barcode ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-1">
                                        {variant.quantity}
                                        {isLow && (
                                          <span
                                            className="size-2 rounded-full bg-rose-500"
                                            title="Low stock"
                                          />
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {variant.min_stock_level}
                                    </TableCell>
                                    <TableCell>
                                      {formatCurrency(variant.additional_price)}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span>
                                          {formatCurrency(
                                            variant.selling_price,
                                          )}
                                        </span>

                                        {variant.selling_price <=
                                        expectedPrice ? (
                                          variant.selling_price ===
                                          expectedPrice ? (
                                            <span className="text-muted-foreground font-mono text-xs">
                                              ={" "}
                                              {formatCurrency(
                                                row.original.base_price ?? 0,
                                              )}{" "}
                                              +{" "}
                                              {formatCurrency(
                                                variant.additional_price,
                                              )}
                                            </span>
                                          ) : (
                                            <span className="text-xs font-medium text-rose-600">
                                              Below expected (
                                              {formatCurrency(expectedPrice)})
                                            </span>
                                          )
                                        ) : null}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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
}

export default ProductDataTable;
