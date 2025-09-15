"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStockAudits } from "@/hooks/tanstack/stock-audit";
import { AlertCircleIcon } from "lucide-react";
import { stockAuditColumns } from "../stock-audit-columns";
import StockAuditDataTable from "./stock-audit-data-table";

interface StockAuditDataTableProps {
  productVariantId: number;
}

const StockAuditTable = ({ productVariantId }: StockAuditDataTableProps) => {
  const { error, isError, isPending, stockAudits } =
    useStockAudits(productVariantId);

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch stock audits data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <StockAuditDataTable
      columns={stockAuditColumns}
      data={stockAudits?.data || []}
    />
  );
};

export default StockAuditTable;
