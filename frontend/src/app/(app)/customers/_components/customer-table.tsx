"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCustomers } from "@/hooks/tanstack/customer";
import { AlertCircleIcon } from "lucide-react";
import { customerColumns } from "../customer-columns";
import CustomerDataTable from "./customer-data-table";

const CustomerTable = () => {
  const { customers, error, isError, isPending } = useCustomers();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch customers data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <CustomerDataTable columns={customerColumns} data={customers?.data || []} />
  );
};

export default CustomerTable;
