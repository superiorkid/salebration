"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductVariantDetail } from "@/hooks/tanstack/product-variants";
import { TProductVariant } from "@/types/product-variant";
import { AlertCircleIcon } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import ProductInformation from "./product-information";
import StockAuditTable from "./stock-audit-table";

const ProductVariantInformation = () => {
  const { productVariantId } = useParams<{ productVariantId: string }>();

  const { error, isError, isPending, productVariant } = useProductVariantDetail(
    Number(productVariantId),
  );

  if (isPending) {
    return <Skeleton className="h-[238px] w-full" />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch product variant detail data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!productVariant?.data) notFound();

  return (
    <>
      <ProductInformation
        productVariant={productVariant?.data as TProductVariant}
      />
      <StockAuditTable productVariantId={Number(productVariantId)} />
    </>
  );
};

export default ProductVariantInformation;
