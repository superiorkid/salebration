"use client";

import { TProductVariant } from "@/types/product-variant";

interface ProductInformationProps {
  productVariant: TProductVariant;
}

const ProductInformation = ({ productVariant }: ProductInformationProps) => {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h3 className="mb-3 text-lg font-medium">Product Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Product Name</p>
          <p className="font-medium">{productVariant?.product.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Variant</p>
          <p className="font-medium">{productVariant?.value}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">SKU</p>
          <p className="font-medium">
            {productVariant?.product.sku}
            {productVariant?.sku_suffix}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Current System Stock</p>
          <p className="font-medium">{productVariant?.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
