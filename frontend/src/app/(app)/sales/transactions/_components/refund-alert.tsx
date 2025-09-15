"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRefundMutation } from "@/hooks/tanstack/sale";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCurrency } from "@/lib/utils";
import { Undo2Icon } from "lucide-react";
import { useState } from "react";

interface RefundAlertProps {
  itemsLength: number;
  total: number;
  transactionId: number;
  onRefundSuccess?: () => void;
}

const RefundAlert = ({
  itemsLength,
  total,
  transactionId,
  onRefundSuccess,
}: RefundAlertProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [reason, setReason] = useState<string>("");
  const debouncedReason = useDebounce(reason, 300);

  const { isPending, refundMutation } = useRefundMutation({
    saleId: transactionId,
    onRefundComplete: () => {
      setShowAlert(false);
      onRefundSuccess?.();
    },
  });

  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <Undo2Icon size={16} strokeWidth={2} className="mr-1" />
          Refund
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will process a refund for this transaction.
            {itemsLength > 1 &&
              " Selected items will be returned to inventory."}
            <div className="mt-2 text-sm font-medium">
              Total Refund Amount: {formatCurrency(total)}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            placeholder="Why refund?"
            disabled={isPending}
            onChange={(event) => setReason(event.target.value)}
            value={reason}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              refundMutation({ reason: debouncedReason });
            }}
          >
            Refund
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RefundAlert;
