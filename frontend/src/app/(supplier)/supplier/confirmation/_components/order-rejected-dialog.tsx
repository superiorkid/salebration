"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMarkPurchaseOrderAsRejected } from "@/hooks/tanstack/purchase-orders";
import { useMarkReorderAsRejected } from "@/hooks/tanstack/reorder";
import { useQueryState } from "nuqs";
import { useState } from "react";
import OrderRejectedForm from "./order-rejected-form";

interface OrderRejectedDialogProps {
  mode?: "purchase_order" | "reorder";
  orderId: number;
}

const OrderRejectedDialog = ({
  mode = "purchase_order",
  orderId,
}: OrderRejectedDialogProps) => {
  const [openDialog, openDialogToggle] = useState<boolean>(false);

  const [token] = useQueryState("token", {
    clearOnDefault: true,
  });

  const [_, setStatus] = useQueryState("status", {
    clearOnDefault: true,
  });

  const mutationParams = {
    token: token as string,
    onSuccess: () => {
      openDialogToggle(false);
      setStatus("rejected");
    },
  };

  const {
    markPurchaseOrderAsRejectedMutation,
    isPending: markPurchaseOrderPending,
  } = useMarkPurchaseOrderAsRejected({
    ...mutationParams,
    purchaseOrderId: orderId,
  });

  const { markReorderAsRejectedMutation, isPending: markReorderPending } =
    useMarkReorderAsRejected({
      ...mutationParams,
      reorderId: orderId,
    });

  const isPending = markReorderPending || markPurchaseOrderPending;

  return (
    <AlertDialog open={openDialog} onOpenChange={openDialogToggle}>
      <AlertDialogTrigger asChild>
        <button className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none">
          Reject Order
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Order Rejection?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reject this purchase order? This action
            will mark the order as rejected and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <OrderRejectedForm
          isPending={isPending}
          onRejectedOrder={
            mode === "reorder"
              ? markReorderAsRejectedMutation
              : markPurchaseOrderAsRejectedMutation
          }
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderRejectedDialog;
