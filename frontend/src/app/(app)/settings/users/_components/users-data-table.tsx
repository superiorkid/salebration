"use client";

import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table-view-options";
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
import { TUser } from "@/types/user";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  CircleAlertIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface UsersDataTableProps {
  columns: ColumnDef<TUser>[];
  data: TUser[];
}

const UsersDataTable = ({ columns, data }: UsersDataTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
    state: {
      columnVisibility,
      sorting,
      rowSelection,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
  });

  const canAddUser = usePermission(PermissionsEnum.ADD_USERS_PAGE);

  const uniqueRoleValues = useMemo(() => {
    const roleColumn = table.getColumn("roles");
    if (!roleColumn) return [];

    const values = Array.from(roleColumn.getFacetedUniqueValues().keys())
      .flat()
      .map((role) => role.name);

    const unique = Array.from(new Set(values));
    return unique.sort();
  }, [table.getColumn("roles")?.getFacetedUniqueValues()]);

  const roleCounts = useMemo(() => {
    const roleColumn = table.getColumn("roles");
    if (!roleColumn) return new Map();

    const rawMap = roleColumn.getFacetedUniqueValues();
    const result = new Map();

    for (const [roleArray, count] of rawMap.entries()) {
      const role = roleArray[0];
      if (!role || !role.name) continue;

      const existing = result.get(role.name) || 0;
      result.set(role.name, existing + count);
    }

    return result;
  }, [table.getColumn("roles")?.getFacetedUniqueValues()]);

  const selectedRoles = useMemo(() => {
    const roleColumn = table.getColumn("roles");
    const filterValue = roleColumn?.getFilterValue() as string[] | undefined;
    return filterValue ?? [];
  }, [table.getColumn("roles")?.getFilterValue()]);

  const handleRoleChange = (checked: boolean, value: string) => {
    const roleColumn = table.getColumn("roles");
    if (!roleColumn) return;

    const currentFilter = (roleColumn.getFilterValue() as string[]) ?? [];
    const newFilterValue = checked
      ? [...new Set([...currentFilter, value])] // avoid duplicates
      : currentFilter.filter((v) => v !== value); // remove unchecked value

    roleColumn.setFilterValue(
      newFilterValue.length ? newFilterValue : undefined,
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              className="peer h-8 w-[289px] ps-9"
              placeholder="Search by name and email..."
              type="search"
              value={globalFilter}
              onChange={(event) =>
                table.setGlobalFilter(String(event.target.value))
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
                Role
                {selectedRoles.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedRoles.length}
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
                  {uniqueRoleValues.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={`${index}`}
                        checked={selectedRoles.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleRoleChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${index}`}
                        className="flex grow justify-between gap-2 font-normal capitalize"
                      >
                        {value}{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {roleCounts.get(value)}
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto h-8" variant="outline">
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
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-rose-500 hover:cursor-pointer hover:bg-rose-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <DataTableViewOptions table={table} />
          {canAddUser && (
            <Link
              href="/settings/users/add"
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

export default UsersDataTable;
