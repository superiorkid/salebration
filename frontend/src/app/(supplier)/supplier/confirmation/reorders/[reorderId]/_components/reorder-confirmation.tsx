"use client";

import { useValidateOrderData } from "@/context/validate-reorder-data-context";
import { formatCurrency } from "@/lib/utils";
import { TReorder } from "@/types/reorder";
import { CheckCircle, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { Suspense } from "react";
import OrderAcceptedDialog from "../../../_components/order-accepted-dialog";
import OrderRejectedDialog from "../../../_components/order-rejected-dialog";

const ReorderConfirmationPage = () => {
  const { tokenData } = useValidateOrderData();
  const reorder = tokenData?.order as TReorder;

  const { reorderId } = useParams<{ reorderId: string }>();

  const [status] = useQueryState("status", {
    clearOnDefault: true,
  });

  if (status === "accepted") {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-green-800">
            Reorder Accepted
          </h2>
          <p className="mt-2 text-green-600">
            #{reorder.purchase_order_number} has been successfully accepted.
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
            Reorder Rejected
          </h2>
          <p className="mt-2 text-red-600">
            #{reorder.purchase_order_number} has been rejected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Reorder Confirmation</h1>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-gray-600">
            PO #: {reorder?.purchase_order_number}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
            {reorder?.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Order Details */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span>{new Date(reorder?.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Delivery:</span>
              <span>
                {reorder?.expected_at
                  ? new Date(reorder.expected_at).toLocaleDateString()
                  : "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items:</span>
              <span>{reorder?.quantity}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Supplier Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600">Supplier Name</p>
              <p>{reorder?.product_variant.product.supplier?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600">Contact Email</p>
              <p>{reorder?.product_variant.product.supplier?.email || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Product Information</h2>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {reorder?.product_variant.product.name}
            </h3>
            <p className="mb-2 text-gray-600">
              Variant: {reorder?.product_variant.value}
            </p>
            <p className="text-gray-600">
              SKU: {reorder?.product_variant.product.sku}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Quantity</p>
            <p className="text-xl font-bold">{reorder?.quantity}</p>
            <p className="mt-2 text-gray-600">Unit Price</p>
            <p className="text-xl font-bold">
              {formatCurrency(reorder?.cost_per_item)}
            </p>
            <p className="mt-2 text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(reorder?.quantity * reorder?.cost_per_item)}
            </p>
          </div>
        </div>
      </div>

      {reorder?.notes && (
        <div className="mt-6 rounded-lg border bg-yellow-50 p-6">
          <h2 className="mb-2 text-lg font-semibold">Additional Notes</h2>
          <p className="whitespace-pre-line">{reorder.notes}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">
        <Suspense>
          <OrderRejectedDialog mode="reorder" orderId={Number(reorderId)} />
          <OrderAcceptedDialog mode="reorder" orderId={Number(reorderId)} />
        </Suspense>
      </div>
    </div>
  );
};

export default ReorderConfirmationPage;
