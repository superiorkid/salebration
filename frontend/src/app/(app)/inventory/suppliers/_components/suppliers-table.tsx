"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSuppliers } from "@/hooks/tanstack/supplier";
import { AlertCircleIcon } from "lucide-react";
import { supplierColumns } from "../supplier-columns";
import SuppliersDataTable from "./suppliers-data-table";

const SuppliersTable = () => {
  const { suppliers, isPending, error, isError } = useSuppliers();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch suppliers data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <SuppliersDataTable
      columns={supplierColumns}
      data={suppliers?.data || []}
    />
  );
};

export default SuppliersTable;
