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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePurchaseOrders } from "@/hooks/tanstack/purchase-orders";
import { useSuppliers } from "@/hooks/tanstack/supplier";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  purchaseOrdersSchema,
  TPurchaseOrderItemSchema,
  TPurchaseOrderSchema,
} from "../add/purchase-orders-schema";
import ProductItems from "./product-items";
import SupplierProducts from "./supplier-products";

const PurchaseOrdersForm = () => {
  const { isPending: isFetchSupplierPending, suppliers } = useSuppliers();

  const form = useForm<TPurchaseOrderSchema>({
    resolver: zodResolver(purchaseOrdersSchema),
    defaultValues: {
      supplierId: undefined,
      expectedAt: undefined,
      notes: "",
      items: [],
    },
  });

  const supplierWatch = form.watch("supplierId");

  const {
    createPurchaseOrderMutation,
    isPending: isCreatingPurchaseOrdersPending,
  } = useCreatePurchaseOrders();

  const onSubmit = (values: TPurchaseOrderSchema) => {
    createPurchaseOrderMutation(values);
  };

  const itemsFieldArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onAddProduct = (value: TPurchaseOrderItemSchema) => {
    const currentItems = form.getValues("items");
    const existingItemIndex = currentItems.findIndex(
      (item) => item.productVariantId === value.productVariantId,
    );

    if (existingItemIndex >= 0) {
      itemsFieldArray.update(existingItemIndex, {
        ...currentItems[existingItemIndex],
        quantity: currentItems[existingItemIndex].quantity + value.quantity,
        unitPrice: value.unitPrice,
      });
    } else {
      itemsFieldArray.append({
        productVariantId: value.productVariantId,
        productName: value.productName,
        quantity: value.quantity,
        unitPrice: value.unitPrice,
      });
    }
  };

  useEffect(() => {
    form.setValue("items", []);
  }, [supplierWatch]);

  return (
    <Form {...form}>
      <div className="flex gap-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-6"
        >
          <div className="grid grid-cols-2 items-start gap-4">
            <FormField
              control={form.control}
              name="supplierId"
              disabled={isCreatingPurchaseOrdersPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                      value={String(field.value)}
                      disabled={field.disabled}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isFetchSupplierPending ? (
                          <SelectItem disabled value="0">
                            Loading...
                          </SelectItem>
                        ) : (
                          (suppliers?.data || []).map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={String(supplier.id)}
                            >
                              {supplier.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedAt"
              disabled={isCreatingPurchaseOrdersPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
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
                          disabled={(date) =>
                            date < new Date() || isCreatingPurchaseOrdersPending
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            disabled={isCreatingPurchaseOrdersPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {supplierWatch && (
            <div className="border-y py-6">
              <ProductItems fieldArray={itemsFieldArray} />
            </div>
          )}

          <Button type="submit" disabled={isCreatingPurchaseOrdersPending}>
            {isCreatingPurchaseOrdersPending ? "Creating..." : "Create"}
          </Button>
        </form>
        <div className="w-[634px]">
          {supplierWatch ? (
            <SupplierProducts handleAppendProduct={onAddProduct} />
          ) : (
            <div className="text-muted-foreground flex justify-center font-medium">
              <p>no supplier selected</p>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default PurchaseOrdersForm;
