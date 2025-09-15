import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { TSale } from "@/types/sale";

interface InvoiceItemsProps {
  sale?: TSale;
}

const InvoiceItems = ({ sale }: InvoiceItemsProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <h2 className="font-semibold 2xl:text-lg">Item Details</h2>
        <p className="text-muted-foreground text-sm">
          Detail item with more info
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sale?.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {item.product_variant?.product.name}{" "}
                {item.product_variant?.value}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {formatCurrency(
                  Number(item.product_variant?.product.base_price) +
                    Number(item.product_variant?.additional_price),
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.subtotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col items-end space-y-1.5">
        <div className="flex w-[267px] items-center justify-between font-semibold">
          <p className="text-right">Total</p>
          <p>{formatCurrency(sale?.total || 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItems;
