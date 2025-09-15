"use client";

import { useValidateOrderData } from "@/context/validate-reorder-data-context";
import { formatCurrency } from "@/lib/utils";
import { TPurchaseOrder } from "@/types/purchase-order";
import { CheckCircle, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { Suspense, useMemo } from "react";
import OrderAcceptedDialog from "../../../_components/order-accepted-dialog";
import OrderRejectedDialog from "../../../_components/order-rejected-dialog";

const PurchaseOrderConfirmation = () => {
  const { tokenData } = useValidateOrderData();
  const order = tokenData?.order as TPurchaseOrder;

  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();

  const [status] = useQueryState("status", {
    clearOnDefault: true,
  });

  const totalAmount = useMemo(() => {
    return order?.purchase_order_items.reduce((sum, item) => {
      return sum + item.quantity * item.unit_price;
    }, 0);
  }, [order]);

  if (status === "accepted") {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-green-800">
            Purchase Order Accepted
          </h2>
          <p className="mt-2 text-green-600">
            #{order.purchase_order_number} has been successfully accepted.
          </p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-red-800">
            Purchase Order Rejected
          </h2>
          <p className="mt-2 text-red-600">
            #{order.purchase_order_number} has been rejected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Purchase Order Confirmation</h1>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-gray-600">
            PO #: {order?.purchase_order_number}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
            {order?.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span>
                {new Date(order?.created_at as Date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Delivery:</span>
              <span>
                {order?.expected_at
                  ? new Date(order.expected_at).toLocaleDateString()
                  : "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items:</span>
              <span>{order?.purchase_order_items.length}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Supplier Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600">Supplier Name</p>
              <p>{order?.supplier.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Contact Email</p>
              <p>{order?.supplier.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p>{order?.supplier.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
        <div className="space-y-6">
          {order?.purchase_order_items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between border-b pb-4"
            >
              <div>
                <h3 className="text-lg font-medium">
                  {item.product_variant.product.name}
                </h3>
                <p className="mb-2 text-gray-600">
                  Variant: {item.product_variant.value}
                </p>
                <p className="text-gray-600">
                  SKU: {item.product_variant.product.sku}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Quantity</p>
                <p className="text-xl font-bold">{item.quantity}</p>
                <p className="mt-2 text-gray-600">Unit Price</p>
                <p className="text-xl font-bold">
                  {formatCurrency(item.unit_price)}
                </p>
                <p className="mt-2 text-gray-600">Total</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <div className="w-[300px]">
            <div className="flex justify-between border-t py-4 font-bold">
              <span>Grand Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {order?.notes && (
        <div className="mt-6 rounded-lg border bg-yellow-50 p-6">
          <h2 className="mb-2 text-lg font-semibold">Additional Notes</h2>
          <p className="whitespace-pre-line">{order.notes}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">
        <Suspense>
          <OrderRejectedDialog orderId={Number(purchaseOrderId)} />
          <OrderAcceptedDialog orderId={Number(purchaseOrderId)} />
        </Suspense>
      </div>
    </div>
  );
};

export default PurchaseOrderConfirmation;
