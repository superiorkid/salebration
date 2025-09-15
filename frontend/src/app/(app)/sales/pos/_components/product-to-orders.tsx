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
import { usePosSession } from "@/context/pos-session-context";
import { formatCurrency } from "@/lib/utils";
import { XIcon } from "lucide-react";
import Image from "next/image";

const ProductToOrders = () => {
  const { updateQuantity, removeItem, items, clearItems } = usePosSession();

  return (
    <div className="space-y-4">
      <Button
        className="ml-auto"
        size="sm"
        disabled={!items.length}
        onClick={() => clearItems()}
      >
        <XIcon size={16} />
        Clear Orders
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sub Total</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length < 1 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-4 text-center font-medium text-rose-500"
              >
                No Items Selected
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  <div className="relative size-8">
                    <Image
                      fill
                      alt={`${item.variant.product.name} image`}
                      src={item.variant.product.image}
                      className="object-cover"
                      loading="lazy"
                      quality={65}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <span>
                    {item.variant.product.name} {item.variant.value}
                  </span>
                </TableCell>

                <TableCell className="space-x-3">
                  <Button
                    size="icon"
                    onClick={() =>
                      updateQuantity(item.variant.id, item.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    size="icon"
                    onClick={() =>
                      updateQuantity(item.variant.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </TableCell>

                <TableCell>
                  {formatCurrency(item.variant.selling_price)}
                </TableCell>

                <TableCell>{formatCurrency(item.subtotal)}</TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="link"
                    className="hover:cursor-pointer"
                    onClick={() => removeItem(item.variant.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductToOrders;
