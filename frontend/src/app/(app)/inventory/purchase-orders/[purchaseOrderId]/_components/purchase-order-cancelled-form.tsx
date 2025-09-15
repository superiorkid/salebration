"use client";

import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  purchaseOrderCancellededSchema,
  TPurchaseOrderCancelled,
} from "../purchase-order-cancelled-schema";

interface PurchaseOrderCancelledFormProps {
  onCancelledOrder: (values: TPurchaseOrderCancelled) => void;
  isPending: boolean;
}

const PurchaseOrderCancelledForm = ({
  isPending,
  onCancelledOrder,
}: PurchaseOrderCancelledFormProps) => {
  const form = useForm<TPurchaseOrderCancelled>({
    resolver: zodResolver(purchaseOrderCancellededSchema),
    defaultValues: {
      cancellation_reason: "",
    },
  });

  const onSubmit = (values: TPurchaseOrderCancelled) => {
    onCancelledOrder(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cancellation_reason"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cancellation Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Reason for cancellation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <AlertDialogCancel type="button" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <Button type="submit" disabled={isPending}>
            Accepted
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PurchaseOrderCancelledForm;
