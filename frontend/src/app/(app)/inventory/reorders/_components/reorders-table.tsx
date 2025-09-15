"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReorders } from "@/hooks/tanstack/reorder";
import { AlertCircleIcon } from "lucide-react";
import { reorderColumns } from "../reorders-columns";
import PurchaseOrdersDataTable from "./reorders-data-table";

const ReordersTable = () => {
  const { error, isError, isPending, reorders } = useReorders();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch reorders data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <PurchaseOrdersDataTable
      columns={reorderColumns}
      data={reorders?.data || []}
    />
  );
};

export default ReordersTable;
