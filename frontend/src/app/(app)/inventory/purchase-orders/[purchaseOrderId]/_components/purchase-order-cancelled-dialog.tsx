"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMarkPurchaseOrderAsCancelled } from "@/hooks/tanstack/purchase-orders";
import { XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import PurchaseOrderCancelledForm from "./purchase-order-cancelled-form";

interface PurchaseOrderCancelledDialogProps {
  handleDropdownClose: () => void;
}

const PurchaseOrderCancelledDialog = ({
  handleDropdownClose,
}: PurchaseOrderCancelledDialogProps) => {
  const [openDialog, openDialogToggle] = useState<boolean>(false);
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();

  const {
    isPending: isMarkAsCancelledPending,
    markPurchaseOrderAsCancelledMutation,
  } = useMarkPurchaseOrderAsCancelled({
    purchaseOrderId: Number(purchaseOrderId),
    onSuccess: () => {
      handleDropdownClose();
      openDialogToggle(false);
    },
  });

  return (
    <AlertDialog open={openDialog} onOpenChange={openDialogToggle}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600"
          onSelect={(event) => event.preventDefault()}
        >
          <XIcon className="mr-2 h-4 w-4" />
          Cancel Order
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this purchase order?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark PO #{purchaseOrderId} as cancelled. Please provide a
            reason for cancellation below. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <PurchaseOrderCancelledForm
          isPending={isMarkAsCancelledPending}
          onCancelledOrder={markPurchaseOrderAsCancelledMutation}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PurchaseOrderCancelledDialog;
