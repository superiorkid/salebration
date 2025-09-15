"use client";

import { Input } from "@/components/ui/input";
import { useSearchProducts } from "@/hooks/tanstack/product-variants";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import {
  TPurchaseOrderItemSchema,
  TPurchaseOrderSchema,
} from "../add/purchase-orders-schema";

interface SearchProductsProps {
  handleAppendProduct: (value: TPurchaseOrderItemSchema) => void;
}

const SearchProducts = ({ handleAppendProduct }: SearchProductsProps) => {
  const [hasFocus, setHasFocus] = useState<boolean>(false);

  const form = useFormContext<TPurchaseOrderSchema>();
  const supplierWatch = form.watch("supplierId");

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { isPending, products } = useSearchProducts(
    debouncedSearchTerm || "",
    supplierWatch,
  );

  return (
    <div className="relative">
      <Input
        placeholder="Search Product..."
        className="w-[362px]"
        value={searchTerm || ""}
        onChange={(event) => setSearchTerm(event.target.value)}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setTimeout(() => setHasFocus(false), 300)}
        disabled={!supplierWatch}
      />
      {!!searchTerm && hasFocus && (
        <div className="bg-background absolute top-11 left-0 z-10 max-h-[253px] w-full overflow-y-auto border text-sm shadow">
          {isPending ? (
            <p className="text-muted-foreground p-3">Loading...</p>
          ) : (products?.data || []).length > 0 ? (
            products?.data?.map((product, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:cursor-pointer hover:bg-zinc-100"
                onClick={() => {
                  const currentItems = form.getValues("items");
                  const existingItem = currentItems.find(
                    (item) => item.productVariantId === product.id,
                  );

                  const currentQuantityInCart = existingItem?.quantity || 0;
                  const availableQuantity = product.quantity;

                  if (currentQuantityInCart >= availableQuantity) {
                    toast.error(
                      `Cannot add more. Only ${availableQuantity} available.`,
                    );
                    return;
                  }

                  handleAppendProduct({
                    productVariantId: product.id,
                    productName: `${product.product.name} ${product.value}`,
                    quantity: 1,
                    unitPrice:
                      Number(product.product.base_price) +
                      Number(product.additional_price),
                    // maxQuantity: product.quantity,
                  });
                }}
              >
                <h2 className="font-medium">
                  {product.product.name} {product.value}
                </h2>
                <p className="text-muted-foreground">
                  Qty: <span>{product.quantity}</span>
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 hover:bg-zinc-100">
              <span className="text-muted-foreground">No Product Found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
