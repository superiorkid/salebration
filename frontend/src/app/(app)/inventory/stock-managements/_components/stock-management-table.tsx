"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductVariants } from "@/hooks/tanstack/product-variants";
import { AlertCircleIcon, TriangleAlertIcon } from "lucide-react";
import { useMemo } from "react";
import { stockManagementColumns } from "../stock-management-columns";
import StockManagementDataTable from "./stock-management-data-table";

const StockManagementTable = () => {
  const { productVariants, error, isError, isPending } = useProductVariants();

  const hasLowStockProducts = useMemo(
    () =>
      productVariants?.data?.some(
        (variant) => variant.quantity > variant.min_stock_level,
      ),
    [productVariants],
  );

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch product variants data"}
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="mt-7 space-y-7">
      {hasLowStockProducts && (
        <div className="rounded-md border border-red-500/50 bg-rose-100/70 px-4 py-3 text-red-600">
          <p className="text-sm">
            <TriangleAlertIcon
              className="me-3 -mt-0.5 inline-flex opacity-60"
              size={16}
              aria-hidden="true"
            />
            Some products have low stock levels. Please review and restock as
            necessary.
          </p>
        </div>
      )}

      <StockManagementDataTable
        columns={stockManagementColumns}
        data={productVariants?.data || []}
      />
    </div>
  );
};

export default StockManagementTable;
