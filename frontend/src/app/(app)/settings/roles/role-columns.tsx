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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionsEnum } from "@/enums/permissions";
import { useDeleteRole } from "@/hooks/tanstack/role";
import { usePermission } from "@/hooks/use-permission";
import { TPermission } from "@/types/permission";
import { TRole } from "@/types/role";
import { ColumnDef } from "@tanstack/react-table";
import {
  Loader2Icon,
  MoreHorizontal,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const roleColumns: ColumnDef<TRole>[] = [
  {
    accessorKey: "id",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "guard_name",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Guard Type" />
    ),
  },
  {
    accessorKey: "permissions",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Privileges" />
    ),
    cell: ({ row }) => {
      const permissions: TPermission[] = row.original.permissions;
      return (
        <div className="flex flex-wrap gap-1">
          {permissions.map((permission) => (
            <span
              key={permission.id}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              {permission.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created On" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue("created_at")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue("updated_at")).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { name, id } = row.original;
      const isAdmin = name === "admin";
      return <ActionRow isAdmin={isAdmin} roleId={id} />;
    },
  },
];

function ActionRow({ roleId, isAdmin }: { roleId: number; isAdmin: boolean }) {
  const [dropdownOpen, dropdownToggle] = useState<boolean>(false);
  const [dialogOpen, dialogToggle] = useState<boolean>(false);

  const canEditRole = usePermission(PermissionsEnum.EDIT_ROLES);
  const canDeleteRole = usePermission(PermissionsEnum.DELETE_ROLES);
  const hasAnyPermission = canEditRole || canDeleteRole;

  const { deleteRoleMutation, isPending } = useDeleteRole({
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
          className="h-8 w-8 p-0"
          disabled={isAdmin || !hasAnyPermission}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isAdmin && (
          <>
            {canEditRole && (
              <DropdownMenuItem asChild>
                <Link href={`/settings/roles/${roleId}/edit`}>
                  <SquarePenIcon strokeWidth={2} size={16} className="mr-1" />
                  Edit Role
                </Link>
              </DropdownMenuItem>
            )}
            {canDeleteRole && (
              <AlertDialog open={dialogOpen} onOpenChange={dialogToggle}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <TrashIcon size={16} strokeWidth={2} className="mr-1" />
                    Delete Role
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete this role permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the role and revoke all associated
                      permissions. Users assigned to this role will lose access.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={() => deleteRoleMutation(roleId)}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Confirm Delete"
                      )}
                    </Button>
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
