"use client";

import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
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
  reorderCancelledSchema,
  TReorderCancelled,
} from "../reorder-cancelled.schema";

interface ReorderCancelledFormProps {
  onCancelledHandler: (values: TReorderCancelled) => void;
  isPending: boolean;
}

const ReorderCancelledForm = ({
  isPending,
  onCancelledHandler,
}: ReorderCancelledFormProps) => {
  const form = useForm<TReorderCancelled>({
    resolver: zodResolver(reorderCancelledSchema),
    defaultValues: {
      cancellationReason: "",
    },
  });

  const onSubmit = (
    values: TReorderCancelled,
    event?: React.BaseSyntheticEvent,
  ) => {
    event?.preventDefault();
    onCancelledHandler(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="cancellationReason"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter cancelled reason" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button type="submit" disabled={isPending}>
            Mark as Cancelled
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export default ReorderCancelledForm;
