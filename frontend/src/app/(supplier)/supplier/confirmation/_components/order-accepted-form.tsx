"use client";

import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderAcceptedSchema, TOrderAccepted } from "../order-accepted-schema";

interface PurchaseOrderAcceptedFormProps {
  onAcceptedOrder: (values: TOrderAccepted) => void;
  isPending: boolean;
}

const PurchaseOrderAcceptedForm = ({
  onAcceptedOrder,
  isPending,
}: PurchaseOrderAcceptedFormProps) => {
  const form = useForm<TOrderAccepted>({
    resolver: zodResolver(orderAcceptedSchema),
    defaultValues: {
      acceptance_notes: "",
    },
  });

  const onSubmit = (values: TOrderAccepted) => {
    onAcceptedOrder(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="acceptance_notes"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acceptance Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter acceptance notes or type '-'"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide details about the acceptance. If there are no
                specific notes, enter a hyphen (&laquo;-&laquo;).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <AlertDialogCancel disabled={isPending} type="button">
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

export default PurchaseOrderAcceptedForm;
