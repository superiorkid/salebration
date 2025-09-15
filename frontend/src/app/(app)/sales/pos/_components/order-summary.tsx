"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePosSession } from "@/context/pos-session-context";
import { PermissionsEnum } from "@/enums/permissions";
import { useSearchProducts } from "@/hooks/tanstack/product-variants";
import { useDebounce } from "@/hooks/use-debounce";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRightIcon,
  CreditCardIcon,
  SearchIcon,
  ShoppingCartIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddCustomer from "../../_components/add-customer";
import PaymentMethodSelections from "./payment-method-selection";

const OrderSummary = () => {
  const { updateQuantity, removeItem, items, clearItems, total, addItem } =
    usePosSession();

  const [searchKeyword, setSearchKeyword] = useState<string | null>(null);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const { isPending, products } = useSearchProducts(debouncedKeyword || "");

  const canHandlePayWithCash = usePermission(PermissionsEnum.CREATE_SALES);
  const canHandlePayWithQRis = usePermission(PermissionsEnum.QRIS_PAYMENT);
  const hasAnyPermission = canHandlePayWithCash || canHandlePayWithQRis;

  return (
    <div className="flex gap-4">
      <div className="h-full flex-1 space-y-8 divide-y p-6">
        <div className="pb-6">
          <div className="relative">
            <Input
              className="peer h-8 ps-9 pe-9 2xl:h-10"
              placeholder="Search for products..."
              type="search"
              value={searchKeyword || ""}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
              type="submit"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 2xl:grid-cols-4">
          {isPending ? (
            <div className="col-span-full flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (products?.data || []).length < 1 ? (
            <div className="col-span-full py-10 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-2 text-lg font-medium">No products found</p>
              <p className="mt-1">Try a different search term</p>
            </div>
          ) : (
            products?.data?.map((product, index) => (
              <div
                key={index}
                className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                onClick={() => addItem(product)}
              >
                <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
                  {product.product.image ? (
                    <Image
                      fill
                      src={product.product.image}
                      alt={product.product.name}
                      className="h-full w-full rounded-md object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="line-clamp-1 text-center font-medium text-gray-800">
                  {product.product.name} ({product.value})
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  SKU: {product.product.sku || "N/A"}
                </p>
                <span className="mt-1.5 font-bold text-sky-600">
                  {formatCurrency(product.selling_price)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* sidebar */}
      <div className="min-w-sm 2xl:min-w-lg">
        <div className="h-full rounded-lg border shadow-lg">
          <div className="border-b p-4">
            <div className="mb-3">
              <AddCustomer />
            </div>
          </div>

          <div className="border-b p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <Button
                variant="ghost"
                size="sm"
                disabled={!items.length}
                onClick={() => clearItems()}
                className="text-destructive hover:text-destructive"
              >
                <XIcon size={16} className="mr-1" />
                Clear All
              </Button>
            </div>

            <div className="mb-4 space-y-1">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {items.length > 0 && (
                <p className="text-muted-foreground text-sm">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
              )}
            </div>

            {hasAnyPermission && (
              <PaymentMethodSelections>
                <Button className="w-full" size="lg" disabled={!items.length}>
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  Process Payment
                </Button>
              </PaymentMethodSelections>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length < 1 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingCartIcon className="text-muted-foreground h-12 w-12" />
                <p className="text-muted-foreground mt-2 font-medium">
                  No items added
                </p>
                <p className="text-muted-foreground text-sm">
                  Start by selecting products
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.variant.id}
                    className="hover:bg-muted/50 rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                          <Image
                            fill
                            alt={item.variant.product.name}
                            src={item.variant.product.image}
                            className="object-cover"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.variant.product.name}
                            {item.variant.value && (
                              <span className="text-muted-foreground">
                                {" "}
                                ({item.variant.value})
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {formatCurrency(item.variant.selling_price)}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8 shrink-0"
                        onClick={() => removeItem(item.variant.id)}
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            updateQuantity(item.variant.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            updateQuantity(item.variant.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>

                      <p className="font-medium">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
