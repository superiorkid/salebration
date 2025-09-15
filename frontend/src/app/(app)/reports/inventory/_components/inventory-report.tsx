"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInventoryReport } from "@/hooks/tanstack/reports";
import { TInventoryReportSummary } from "@/types/inventory-report";
import { AlertCircleIcon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import InventorySummary from "./inventory-summary";
import InventoryTable from "./inventory-table";

const InventoryReport = () => {
  const [category, _setCategory] = useQueryState("category", {
    parse: (value) => Number(value),
    serialize: (value) => value?.toString() ?? "",
  });
  const [supplier, _setSupplier] = useQueryState("supplier", {
    parse: (value) => Number(value),
    serialize: (value) => value?.toString() ?? "",
  });
  const [showLowStock, _setShowLowStock] = useQueryState(
    "showLowStock",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const { error, inventoryReport, isError, isPending } = useInventoryReport({
    showLowStock,
    category: Number(category),
    supplier: Number(supplier),
  });

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch inventory report data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <InventorySummary
        summaryData={inventoryReport?.data?.summary as TInventoryReportSummary}
      />
      <InventoryTable tableData={inventoryReport?.data?.table || []} />
    </div>
  );
};

export default InventoryReport;
