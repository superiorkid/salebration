"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductVariantDetail } from "@/hooks/tanstack/product-variants";
import { TProductVariant } from "@/types/product-variant";
import { AlertCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import ProductInformation from "../../_components/product-information";
import AuditProductForm from "./audit-product-form";

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

  return (
    <>
      <ProductInformation
        productVariant={productVariant?.data as TProductVariant}
      />
      <AuditProductForm systemQuantity={productVariant?.data?.quantity || 0} />
    </>
  );
};

export default ProductVariantInformation;
