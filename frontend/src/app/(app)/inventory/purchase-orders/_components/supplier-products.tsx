"use client";

import { useSearchProducts } from "@/hooks/tanstack/product-variants";
import { useDebounce } from "@/hooks/use-debounce";
import { TProductVariant } from "@/types/product-variant";
import { useFormContext } from "react-hook-form";
import {
  TPurchaseOrderItemSchema,
  TPurchaseOrderSchema,
} from "../add/purchase-orders-schema";

interface SupplierProductsProps {
  handleAppendProduct: (value: TPurchaseOrderItemSchema) => void;
}

const SupplierProducts = ({ handleAppendProduct }: SupplierProductsProps) => {
  const form = useFormContext<TPurchaseOrderSchema>();
  const supplierId = form.watch("supplierId");
  const debouncedSupplierId = useDebounce(supplierId, 300);

  const { isPending, products } = useSearchProducts("", debouncedSupplierId);

  const handleProductClick = (product: TProductVariant) => {
    handleAppendProduct({
      productVariantId: product.id,
      productName: `${product.product.name} ${product.value}`,
      quantity: 1,
      unitPrice:
        Number(product.product.base_price) + Number(product.additional_price),
    });
  };

  if (isPending) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-2.5">
      {products?.data?.map((product) => {
        const currentItems = form.getValues("items");
        const existingItem = currentItems.find(
          (item) => item.productVariantId === product.id,
        );

        const isSelected = Boolean(existingItem);

        return (
          <button
            key={product.id}
            type="button"
            className={`relative flex w-full cursor-pointer flex-col items-start rounded-md border p-3 shadow-sm transition hover:shadow-md ${
              isSelected ? "bg-gray-50" : "bg-white"
            }`}
            onClick={() => handleProductClick(product)}
          >
            {isSelected && (
              <span className="absolute top-2 right-2 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
                Selected
              </span>
            )}

            <div className="font-medium">
              {product.product.name} {product.value}
            </div>
            <div className="text-sm text-gray-600">
              Qty Available: {product.quantity}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SupplierProducts;
