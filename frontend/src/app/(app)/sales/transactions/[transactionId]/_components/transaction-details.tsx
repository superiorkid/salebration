"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDetailTransaction } from "@/hooks/tanstack/sale";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface TransactionDetailsProps {
  transactionId: number;
}

const TransactionDetails = ({ transactionId }: TransactionDetailsProps) => {
  const { error, isError, isPending, transaction } =
    useDetailTransaction(transactionId);

  if (isPending) {
    return (
      <div className="flex justify-center py-8">
        Loading transaction detail...
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch transaction detail"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!transaction?.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Transaction Header */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Transaction Information</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span>#{transaction?.data?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>
                {format(
                  transaction?.data?.created_at as Date,
                  "dd/LL/yyyy HH:mm",
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge>{transaction?.data?.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operator:</span>
              <span>{transaction?.data?.operator.name}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Invoice</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice Number:</span>
              <span>{transaction?.data?.invoice.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issued At:</span>
              <span>
                {format(
                  transaction?.data?.invoice.issued_at as Date,
                  "dd/LL/yyyyy HH:mm",
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span>{formatCurrency(transaction?.data?.total || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid:</span>
              <span>{formatCurrency(transaction?.data?.paid || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Change:</span>
              <span>{formatCurrency(transaction?.data?.change || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Customer Information */}
      {transaction?.data?.customer && (
        <>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{transaction.data.customer.name}</span>
              </div>
              {transaction?.data.customer.email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{transaction?.data.customer.email}</span>
                </div>
              )}
              {transaction?.data.customer.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{transaction?.data.customer.phone}</span>
                </div>
              )}
              {transaction?.data?.customer.company_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span>{transaction?.data?.customer.company_name}</span>
                </div>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Items List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {transaction?.data?.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">
                      {item.product_variant.product?.name || "Unknown Product"}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {item.product_variant.product.name}{" "}
                      {item.product_variant.value}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Separator />

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <div className="space-y-3">
          {transaction?.data?.payments.map((payment) => (
            <div
              key={payment.id}
              className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-3"
            >
              <div>
                <p className="text-muted-foreground text-sm">Method</p>
                <p className="capitalize">{payment.method}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Amount</p>
                <p>{formatCurrency(payment.amount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Paid At</p>
                <p>{format(payment.paid_at as Date, "dd/LL/yyyy HH:mm")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
