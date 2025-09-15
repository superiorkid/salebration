"use client";

import { FormSkeleton } from "@/components/form-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductVariantDetail } from "@/hooks/tanstack/product-variants";
import { AlertCircleIcon } from "lucide-react";
import ReorderForm from "./reorder-form";

interface ProductDetailProps {
  variantId: string;
}

const ProductDetail = ({ variantId }: ProductDetailProps) => {
  const { error, isError, isPending, productVariant } = useProductVariantDetail(
    Number(variantId),
  );

  if (isPending && productVariant && !productVariant.data) {
    <FormSkeleton
      fields={[
        { type: "input", label: true },
        { type: "input", label: true },
        { type: "input", label: true },
        { type: "textarea", label: true },
        { type: "switch", label: true },
      ]}
    />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch product variant data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      <div className="rounded-lg border bg-gray-50 p-4">
        <h2 className="mb-2 text-lg font-semibold">Product Variant Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Product Name</p>
            <p className="font-medium">{productVariant?.data?.product.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Variant</p>
            <p className="font-medium">
              {productVariant?.data?.attribute}: {productVariant?.data?.value}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">SKU</p>
            <p className="font-medium">
              {productVariant?.data?.product.sku}
              {productVariant?.data?.sku_suffix}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Barcode</p>
            <p className="font-medium">{productVariant?.data?.barcode}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Current Stock</p>
            <p className="font-medium">{productVariant?.data?.quantity}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Reorder Threshold</p>
            <p className="font-medium">
              {productVariant?.data?.min_stock_level}
            </p>
          </div>
        </div>
      </div>

      <ReorderForm variantId={Number(productVariant?.data?.id)} />
    </div>
  );
};

export default ProductDetail;
