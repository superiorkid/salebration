"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMarkPurchaseOrderAsAccepted } from "@/hooks/tanstack/purchase-orders";
import { useMarkReorderAsAccepted } from "@/hooks/tanstack/reorder";
import { useQueryState } from "nuqs";
import { useState } from "react";
import PurchaseOrderAcceptedForm from "./order-accepted-form";

interface OrderAcceptedDialogProps {
  mode?: "purchase_order" | "reorder";
  orderId: number;
}

const OrderAcceptedDialog = ({
  mode = "purchase_order",
  orderId,
}: OrderAcceptedDialogProps) => {
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
      setStatus("accepted");
    },
  };

  const {
    markPurchaseOrderAsAcceptedMutation,
    isPending: markPurchaseOrderPending,
  } = useMarkPurchaseOrderAsAccepted({
    ...mutationParams,
    purchaseOrderId: orderId,
  });

  const { markReorderAsAcceptedMutation, isPending: markReorderPending } =
    useMarkReorderAsAccepted({
      ...mutationParams,
      reorderId: orderId,
    });

  const isPending = markPurchaseOrderPending || markReorderPending;

  return (
    <AlertDialog open={openDialog} onOpenChange={openDialogToggle}>
      <AlertDialogTrigger asChild>
        <button className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none">
          Accept Order
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Order Acceptance?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to accept this purchase order? This action
            will mark the order as accepted and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <PurchaseOrderAcceptedForm
          onAcceptedOrder={
            mode === "reorder"
              ? markReorderAsAcceptedMutation
              : markPurchaseOrderAsAcceptedMutation
          }
          isPending={isPending}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderAcceptedDialog;
