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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionsEnum } from "@/enums/permissions";
import { useDeleteCategory } from "@/hooks/tanstack/product-categories";
import { usePermission } from "@/hooks/use-permission";
import { TProductCategory } from "@/types/product-category";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  EllipsisIcon,
  Loader2Icon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import CategoryDialog from "./_components/category-dialog";

const parentFilterFn: FilterFn<TProductCategory> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const parent = row.getValue(columnId) as string;
  return filterValue.includes(parent);
};

export const categoryColumns: ColumnDef<TProductCategory>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "parent",
    accessorFn: (row) => row.parent?.name,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent" />
    ),
    cell: ({ row }) => {
      const parent = row.original.parent?.name;
      return (
        <div>{!parent ? "-" : <Badge variant="secondary">{parent}</Badge>}</div>
      );
    },
    filterFn: parentFilterFn,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div>{format(new Date(createdAt), "dd/LL/yyyy")}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at;
      return <div>{format(new Date(updatedAt), "dd/LL/yyyy")}</div>;
    },
  },
  {
    id: "Action",
    cell: ({ row }) => {
      const categoryId = row.original.id;
      return <CategoryColumnAction categoryId={categoryId} />;
    },
  },
];

function CategoryColumnAction({ categoryId }: { categoryId: number }) {
  const [openDropdown, dropdownToggle] = useState<boolean>(false);

  const { deleteCategoryMutation, isPending: deleteCategoryPending } =
    useDeleteCategory();

  const canEditCategory = usePermission(PermissionsEnum.EDIT_CATEGORIES);
  const canDeleteCategory = usePermission(PermissionsEnum.DELETE_CATEGORIES);

  return (
    <DropdownMenu open={openDropdown} onOpenChange={dropdownToggle}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-5">
          <EllipsisIcon />
          <span className="sr-only">More Action</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canEditCategory && (
          <CategoryDialog categoryId={categoryId}>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <SquarePenIcon strokeWidth={2} size={16} className="mr-1" />
              Edit Category
            </DropdownMenuItem>
          </CategoryDialog>
        )}
        {canDeleteCategory && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(event) => event.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon size={16} strokeWidth={2} className="mr-2" />
                Delete Category
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this category?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the category and its
                  subcategories. Products in this category will remain but will
                  be uncategorized. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteCategoryPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleteCategoryPending}
                  onClick={() => deleteCategoryMutation(categoryId)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {deleteCategoryPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Category"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
