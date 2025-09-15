"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUsers } from "@/hooks/tanstack/users";
import { AlertCircleIcon } from "lucide-react";
import { usersColumns } from "../users-columns";
import UsersDataTable from "./users-data-table";

const UsersTable = () => {
  const { users, error, isError, isPending } = useUsers();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch users data"}
        </AlertDescription>
      </Alert>
    );
  }

  return <UsersDataTable columns={usersColumns} data={users?.data || []} />;
};

export default UsersTable;
