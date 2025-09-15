"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProducts } from "@/hooks/tanstack/product";
import { AlertCircleIcon } from "lucide-react";
import { productColumns } from "../product-columns";
import ProductDataTable from "./product-data-table";

const ProductTable = () => {
  const { products, isPending, error, isError } = useProducts();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch products data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ProductDataTable columns={productColumns} data={products?.data || []} />
  );
};

export default ProductTable;
