"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePurchaseOrders } from "@/hooks/tanstack/purchase-orders";
import { AlertCircleIcon } from "lucide-react";
import { purchaseOrderColumns } from "../purchase-orders-columns";
import PurchaseOrdersDataTable from "./purchase-orders-data-table";

const PurchaseOrdersTable = () => {
  const { isPending, error, isError, purchaseOrders } = usePurchaseOrders();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch purchase orders data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <PurchaseOrdersDataTable
      columns={purchaseOrderColumns}
      data={purchaseOrders?.data || []}
    />
  );
};

export default PurchaseOrdersTable;
