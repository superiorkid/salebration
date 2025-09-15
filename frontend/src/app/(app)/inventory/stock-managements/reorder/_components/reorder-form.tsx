"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReorder } from "@/hooks/tanstack/reorder";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { reorderSchema, TReorder } from "../reorder-schema";

interface ReorderFormProps {
  variantId: number;
}

const ReorderForm = ({ variantId }: ReorderFormProps) => {
  const { createReorderMutation, isPending } = useCreateReorder();

  const form = useForm<TReorder>({
    resolver: zodResolver(reorderSchema),
    defaultValues: {
      quantity: 0,
      expectedDeliveryDate: undefined,
      notes: "",
    },
  });

  const onSubmit = (values: TReorder) => {
    createReorderMutation({ ...values, productVariantId: variantId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantity to Order<span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Quantity to Order" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedDeliveryDate"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Expecting Delivery Date
                  <span className="text-rose-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={field.disabled}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Reorder
        </Button>
      </form>
    </Form>
  );
};

export default ReorderForm;
