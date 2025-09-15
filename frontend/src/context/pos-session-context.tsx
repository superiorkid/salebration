"use client";

import { TProductVariant } from "@/types/product-variant";
import { createContext, useContext, useMemo, useState } from "react";

type CartItem = {
  variant: TProductVariant;
  quantity: number;
  subtotal: number;
};

type PosContextType = {
  items: CartItem[];
  addItem: (variant: TProductVariant) => { success: boolean; message?: string };
  removeItem: (variantId: number) => void;
  clearItems: () => void;
  updateQuantity: (
    variantId: number,
    quantity: number,
  ) => { success: boolean; message?: string };
  total: number;
};

const PosContext = createContext<PosContextType | undefined>(undefined);

interface PosSessionContextProps {
  children: React.ReactNode;
}

export const PosSessionProvider = ({ children }: PosSessionContextProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (variant: TProductVariant) => {
    // Check if variant has stock_quantity property
    if (typeof variant.quantity === "undefined") {
      return { success: false, message: "Product stock information missing" };
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);

      // For existing item, check if we can add more
      if (existing) {
        if (existing.quantity >= variant.quantity) {
          return prev; // Return unchanged items
        }

        return prev.map((item) =>
          item.variant.id === variant.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * variant.selling_price,
              }
            : item,
        );
      }
      // For new item, check if there's any stock
      else {
        if (variant.quantity < 1) {
          return prev; // Return unchanged items
        }

        return [
          ...prev,
          {
            variant,
            quantity: 1,
            subtotal: variant.selling_price,
          },
        ];
      }
    });

    return { success: true };
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return { success: true };
    }

    setItems((prev) => {
      const itemToUpdate = prev.find((item) => item.variant.id === variantId);
      if (!itemToUpdate) {
        return prev;
      }

      // Check stock before updating quantity
      if (quantity > itemToUpdate.variant.quantity) {
        return prev; // Return unchanged items
      }

      return prev.map((item) =>
        item.variant.id === variantId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.variant.selling_price,
            }
          : item,
      );
    });

    return { success: true };
  };

  const removeItem = (variantId: number) => {
    setItems((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const clearItems = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal, 0),
    [items],
  );

  return (
    <PosContext.Provider
      value={{ items, addItem, removeItem, clearItems, updateQuantity, total }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePosSession = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error("usePosSession must be used within a PosSessionProvider");
  }
  return context;
};
