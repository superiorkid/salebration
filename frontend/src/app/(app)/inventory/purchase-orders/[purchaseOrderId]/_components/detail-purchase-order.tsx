"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatusEnum } from "@/enums/order-status";
import { PermissionsEnum } from "@/enums/permissions";
import { useDetailPurchaseOrder } from "@/hooks/tanstack/purchase-orders";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { AlertCircleIcon, MoreVertical, Printer } from "lucide-react";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import PurchaseOrderCancelledDialog from "./purchase-order-cancelled-dialog";
import PurchaseOrderItemRow from "./purchase-order-item-row";

interface DetailPurchaseOrderProps {
  purchaseOrderId: number;
}

const DetailPurchaseOrder = ({ purchaseOrderId }: DetailPurchaseOrderProps) => {
  const [openDropdown, openDropdownToggle] = useState<boolean>(false);

  const {
    error,
    isError,
    isPending: isDetailPurchaseOrderPending,
    purchaseOrder,
  } = useDetailPurchaseOrder(purchaseOrderId);

  const handleCloseDropdown = () => {
    openDropdownToggle(false);
  };

  const totalAmount = useMemo(() => {
    return purchaseOrder?.data?.purchase_order_items.reduce((sum, item) => {
      return sum + item.quantity + item.unit_price;
    }, 0);
  }, [purchaseOrder?.data]);

  const isOrderInReceivableState =
    purchaseOrder?.data?.status === OrderStatusEnum.ACCEPTED ||
    purchaseOrder?.data?.status === OrderStatusEnum.PARTIAL;

  const canCancelPurchaseOrder = usePermission(
    PermissionsEnum.CANCEL_PURCHASE_ORDERS,
  );

  if (isDetailPurchaseOrderPending) {
    return (
      <div className="flex justify-center py-8">
        Loading purchase orders detail...
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch purchase orders detail"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!purchaseOrder?.data) notFound();

  return (
    <div>
      <Card className="border">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>
              Purchase Order: {purchaseOrder?.data?.purchase_order_number}
            </CardTitle>
            <div className="flex gap-2">
              <DropdownMenu
                open={openDropdown}
                onOpenChange={openDropdownToggle}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreVertical className="mr-2 h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </DropdownMenuItem>
                  {purchaseOrder?.data?.status === OrderStatusEnum.PENDING &&
                    canCancelPurchaseOrder && (
                      <PurchaseOrderCancelledDialog
                        handleDropdownClose={handleCloseDropdown}
                      />
                    )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Status</p>
                      <Badge>{purchaseOrder?.data?.status.toUpperCase()}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Order Date
                      </p>
                      <p>
                        {format(
                          new Date(purchaseOrder?.data?.created_at as Date),
                          "MMM dd, yyyy",
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Expected Delivery
                      </p>
                      <p>
                        {purchaseOrder?.data?.expected_at
                          ? format(
                              new Date(purchaseOrder.data.expected_at),
                              "MMM dd, yyyy",
                            )
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Total Amount
                      </p>
                      <p className="font-medium">
                        {formatCurrency(totalAmount || 0)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm">Notes</p>
                    <p className="text-sm">
                      {purchaseOrder?.data?.notes || "No notes provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Supplier Name
                    </p>
                    <p className="font-medium">
                      {purchaseOrder?.data?.supplier.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p>{purchaseOrder?.data?.supplier.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <p>{purchaseOrder?.data?.supplier.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Variant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Ordered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Received
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Pending
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Total
                      </th>
                      {isOrderInReceivableState && (
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {purchaseOrder?.data?.purchase_order_items.map(
                      (item, index) => (
                        <PurchaseOrderItemRow
                          purchaseOrderItem={item}
                          isOrderInReceivableState={isOrderInReceivableState}
                          key={index}
                        />
                      ),
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-3 font-medium text-gray-500"
                      >
                        Totals
                      </td>
                      <td className="px-6 py-3 font-medium">
                        {purchaseOrder?.data?.purchase_order_items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}
                      </td>
                      <td className="px-6 py-3 font-medium">
                        {purchaseOrder?.data?.purchase_order_items.reduce(
                          (sum, item) => sum + (item.received_quantity || 0),
                          0,
                        )}
                      </td>
                      <td className="px-6 py-3 font-medium">
                        {purchaseOrder?.data?.purchase_order_items.reduce(
                          (sum, item) =>
                            sum +
                            (item.quantity - (item.received_quantity || 0)),
                          0,
                        )}
                      </td>
                      <td
                        colSpan={3}
                        className="px-6 py-3 font-bold whitespace-nowrap"
                      >
                        {formatCurrency(totalAmount || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailPurchaseOrder;
