"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStockAudit } from "@/hooks/tanstack/stock-audit";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { TAuditSchema, auditSchema } from "../audit-schema";

interface AuditProductFormProps {
  systemQuantity: number;
}

const AuditProductForm = ({ systemQuantity }: AuditProductFormProps) => {
  const { productVariantId } = useParams<{ productVariantId: string }>();

  const form = useForm<TAuditSchema>({
    resolver: zodResolver(auditSchema),
    defaultValues: { countedQuantity: 0, notes: "" },
  });

  const countedQuantity = form.watch("countedQuantity");
  const debouncedCountedQuantity = useDebounce(countedQuantity, 300);

  const { createStockAuditMutation, isPending } = useCreateStockAudit();

  const onSubmit = (values: TAuditSchema) => {
    createStockAuditMutation({
      ...values,
      productVariantId: Number(productVariantId),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="countedQuantity"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Counted Quantity<span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Physical count..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Difference</FormLabel>
            <div
              className={cn(
                "flex items-center rounded-md border px-3 py-2 text-sm font-medium",
                debouncedCountedQuantity > systemQuantity
                  ? "border-green-200 bg-green-50 text-green-800"
                  : debouncedCountedQuantity < systemQuantity
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "bg-gray-50 text-gray-800",
              )}
            >
              {debouncedCountedQuantity !== undefined ? (
                <>
                  {debouncedCountedQuantity - systemQuantity > 0 ? "+" : ""}
                  {debouncedCountedQuantity - systemQuantity}
                  <span className="ml-2 text-xs opacity-80">
                    (
                    {debouncedCountedQuantity > systemQuantity
                      ? "Overcount"
                      : debouncedCountedQuantity < systemQuantity
                        ? "Undercount"
                        : "Exact match"}
                    )
                  </span>
                </>
              ) : (
                "Enter counted quantity to see difference"
              )}
            </div>
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="notes"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes<span className="text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain any discrepancies or observations..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={isPending}>
          Submit Audit
        </Button>
      </form>
    </Form>
  );
};

export default AuditProductForm;
