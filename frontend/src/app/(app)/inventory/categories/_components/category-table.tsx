"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCategories } from "@/hooks/tanstack/product-categories";
import { AlertCircleIcon } from "lucide-react";
import { categoryColumns } from "../category-columns";
import CategoryDataTable from "./category-data-table";

const CategoryTable = () => {
  const { categories, error, isError, isPending } = useCategories({
    parent_only: false,
  });

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch product categories data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <CategoryDataTable
      columns={categoryColumns}
      data={categories?.data || []}
    />
  );
};

export default CategoryTable;
