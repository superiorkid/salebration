"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { TPurchaseOrderSchema } from "../add/purchase-orders-schema";

interface ProductItemsProps {
  fieldArray: UseFieldArrayReturn<TPurchaseOrderSchema>;
}

const ProductItems = ({ fieldArray }: ProductItemsProps) => {
  const { fields, update, remove } = fieldArray;

  const totalAmount = useMemo(
    () =>
      fields.reduce((sum, item) => {
        return sum + item.quantity * item.unitPrice;
      }, 0),
    [fields],
  );

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Added Product</h2>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Sub Total</TableHead>
              <TableHead className="text-right">&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length < 1 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-5 text-center text-amber-500"
                >
                  No product selected
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{field.productName}</TableCell>
                  <TableCell className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      className="h-6"
                      type="button"
                      onClick={() => {
                        if (field.quantity > 1) {
                          update(index, {
                            ...field,
                            quantity: field.quantity - 1,
                          });
                        }
                      }}
                      disabled={field.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{field.quantity}</span>
                    <Button
                      size="sm"
                      className="h-6"
                      type="button"
                      onClick={() => {
                        update(index, {
                          ...field,
                          quantity: field.quantity + 1,
                        });
                      }}
                    >
                      +
                    </Button>
                  </TableCell>
                  <TableCell>{formatCurrency(field.unitPrice)}</TableCell>
                  <TableCell>
                    {formatCurrency(field.quantity * field.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => remove(index)}
                      size="sm"
                      variant="link"
                      className="hover:cursor-pointer"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow className="bg-zinc-100 pt-3 text-base">
              <TableCell colSpan={4} className="font-bold">
                Total
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(totalAmount)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductItems;
