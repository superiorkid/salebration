"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import {
  AlertDialog,
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
import { useDeleteUser } from "@/hooks/tanstack/users";
import { usePermission } from "@/hooks/use-permission";
import { TUser } from "@/types/user";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  EllipsisIcon,
  EyeIcon,
  Loader2Icon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const roleFilterFn: FilterFn<TUser> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const roles = row.getValue(columnId) as { name: string }[];
  return roles.some((role) => filterValue.includes(role.name));
};

export const usersColumns: ColumnDef<TUser>[] = [
  {
    id: "select",
    enableGlobalFilter: false,
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const roles = row.original.roles;
      const role = roles?.at(0)?.name;

      return <Badge>{role}</Badge>;
    },
    filterFn: roleFilterFn,
  },
  {
    id: "last_login_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
  },
  {
    accessorKey: "created_at",
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div>{format(new Date(createdAt), "dd/LL/yyyy")}</div>;
    },
  },
  {
    id: "Action",
    enableGlobalFilter: false,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const userId = row.original.id;
      return <ActionRow userId={userId} />;
    },
  },
];

function ActionRow({ userId }: { userId: number }) {
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);
  const [dialogOpen, dialogToggle] = useState<boolean>(false);

  const canEditUser = usePermission(PermissionsEnum.EDIT_USERS_PAGE);
  const canDeleteUser = usePermission(PermissionsEnum.DELETE_USERS);
  const canViewDetailUser = usePermission(PermissionsEnum.DETAIL_USERS_PAGE);

  const hasAnyPermission = canEditUser || canDeleteUser || canViewDetailUser;

  const { deleteUserMutation, isPending } = useDeleteUser({
    onSuccess: () => {
      dialogToggle(false);
      dropdownToggle(false);
    },
  });

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={dropdownToggle}>
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
        {canViewDetailUser && (
          <DropdownMenuItem asChild>
            <Link href={`/settings/users/${userId}`}>
              <EyeIcon strokeWidth={2} size={16} className="mr-1" />
              Detail User
            </Link>
          </DropdownMenuItem>
        )}
        {canEditUser && (
          <DropdownMenuItem asChild>
            <Link href={`/settings/users/${userId}/edit`}>
              <SquarePenIcon strokeWidth={2} size={16} className="mr-1" />
              Edit User
            </Link>
          </DropdownMenuItem>
        )}
        {canDeleteUser && (
          <AlertDialog open={dialogOpen} onOpenChange={dialogToggle}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <TrashIcon size={16} strokeWidth={2} className="mr-1" />
                Delete User
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this user account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the user and revoke all their
                  access. Any data created by this user will be retained but
                  disassociated. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => deleteUserMutation(userId)}
                >
                  {isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Deletion"
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
