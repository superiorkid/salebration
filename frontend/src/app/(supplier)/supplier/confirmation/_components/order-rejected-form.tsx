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
import { orderRejectedSchema, TOrderRejected } from "../order-rejected-schema";

interface PurchaseOrderRejectedFormProps {
  onRejectedOrder: (values: TOrderRejected) => void;
  isPending: boolean;
}

const PurchaseOrderRejectedForm = ({
  isPending,
  onRejectedOrder,
}: PurchaseOrderRejectedFormProps) => {
  const form = useForm<TOrderRejected>({
    resolver: zodResolver(orderRejectedSchema),
    defaultValues: {
      rejection_reason: "",
    },
  });

  const onSubmit = (values: TOrderRejected) => {
    onRejectedOrder(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rejection_reason"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rejection Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Reason for rejection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <AlertDialogCancel disabled={isPending} type="button">
            Cancel
          </AlertDialogCancel>
          <Button type="submit" disabled={isPending}>
            Rejected
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PurchaseOrderRejectedForm;
