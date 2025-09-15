"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRoles } from "@/hooks/tanstack/role";
import { AlertCircleIcon } from "lucide-react";
import { roleColumns } from "../role-columns";
import RolesDataTable from "./roles-data-table";

const RolesTable = () => {
  const { error, isError, isPending, roles } = useRoles();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch roles data"}
        </AlertDescription>
      </Alert>
    );
  }

  return <RolesDataTable columns={roleColumns} data={roles?.data || []} />;
};

export default RolesTable;
