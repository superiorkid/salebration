"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusEnum } from "@/enums/order-status";
import { useDetailReorder } from "@/hooks/tanstack/reorder";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircleIcon,
  ClipboardListIcon,
  ClockIcon,
  FileTextIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import { notFound } from "next/navigation";

interface DetailReorderProps {
  reorderId: number;
}

const Detailreorder = ({ reorderId }: DetailReorderProps) => {
  const { error, isError, isPending, reorder } = useDetailReorder(reorderId);

  if (isPending) {
    return (
      <div className="flex justify-center py-8">Loading reorder details...</div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch reorder details"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!reorder?.data) notFound();

  return (
    <div className="space-y-6">
      {/* TODO: action to canceled and received in top of detail */}
      <div className="flex justify-end">
        <Badge>
          {reorder?.data?.status?.toUpperCase() ||
            OrderStatusEnum.PENDING.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <PackageIcon className="text-primary h-5 w-5" />
                <CardTitle>Product</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="text-right font-medium">
                  {reorder?.data?.product_variant.product.name}
                  <span className="text-primary">
                    {" "}
                    ({reorder?.data?.product_variant.value})
                  </span>
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-mono font-medium">
                  {reorder?.data?.product_variant.product.sku}
                  {reorder?.data?.product_variant.sku_suffix && (
                    <span className="text-muted-foreground">
                      {reorder.data.product_variant.sku_suffix}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Stock</span>
                <span
                  className={`font-medium ${
                    Number(reorder?.data?.product_variant.quantity) < 10
                      ? "text-destructive"
                      : "text-success"
                  }`}
                >
                  {reorder?.data?.product_variant.quantity}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <UserIcon className="text-primary h-5 w-5" />
                <CardTitle>Supplier</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">
                  {reorder?.data?.product_variant.product.supplier?.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact</span>
                <a
                  href={`mailto:${reorder?.data?.product_variant.product.supplier?.email}`}
                  className="text-primary font-medium hover:underline"
                >
                  {reorder?.data?.product_variant.product.supplier?.email}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <ClipboardListIcon className="text-primary h-5 w-5" />
                <CardTitle>Order</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">PO Number</span>
                <span className="font-mono font-medium">
                  #{reorder?.data?.purchase_order_number}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{reorder?.data?.quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Product Cost</span>
                <span className="font-medium">
                  {formatCurrency(reorder?.data?.cost_per_item || 0)}
                </span>
              </div>

              <div className="mt-2 flex justify-between border-t pt-2">
                <span className="text-muted-foreground font-semibold">
                  Total
                </span>
                <span className="font-bold">
                  {formatCurrency(
                    Number(reorder?.data?.quantity || 0) *
                      Number(reorder?.data?.cost_per_item || 0),
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {reorder?.data?.notes && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <FileTextIcon className="text-primary h-5 w-5" />
                  <CardTitle>Notes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">
                  {reorder.data.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <ClockIcon className="text-primary h-5 w-5" />
                <CardTitle>Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="bg-primary mt-1.5 h-2 w-2 rounded-full" />
                  </div>
                  <div className="ml-3 space-y-0.5">
                    <p className="text-sm font-medium">Order Created</p>
                    <p className="text-muted-foreground text-sm">
                      {format(
                        new Date(reorder?.data?.created_at as Date),
                        "dd MMM yyyy, HH:mm",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="ml-3 space-y-0.5">
                    <p className="text-sm font-medium">Expected Delivery</p>
                    <p className="text-muted-foreground text-sm">
                      {format(
                        new Date(reorder?.data?.expected_at as Date),
                        "dd MMM yyyy",
                      )}
                    </p>
                  </div>
                </div>

                {reorder?.data?.received_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="bg-success mt-1.5 h-2 w-2 rounded-full" />
                    </div>
                    <div className="ml-3 space-y-0.5">
                      <p className="text-sm font-medium">Received</p>
                      <p className="text-muted-foreground text-sm">
                        {format(
                          new Date(reorder.data.received_at),
                          "dd MMM yyyy, HH:mm",
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Detailreorder;
