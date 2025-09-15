import { z } from "zod";

const purchaseOrderItemSchema = z.object({
  productVariantId: z.coerce.number({
    invalid_type_error: "Product variant ID must be a number",
    required_error: "Product variant ID is required",
  }),
  productName: z.string().min(1, { message: "Product name is required" }),
  quantity: z.coerce
    .number({
      invalid_type_error: "Quantity must be a number",
      required_error: "Quantity is required",
    })
    .min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.coerce
    .number({
      invalid_type_error: "Unit price must be a number",
      required_error: "Unit price is required",
    })
    .min(1, { message: "Unit price must be greater than 0" }),
  // maxQuantity: z.coerce
  //   .number({
  //     invalid_type_error: "Max quantity must be a number",
  //     required_error: "Max quantity is required",
  //   })
  //   .min(1, { message: "Max quantity must be at least 1" }),
});

export const purchaseOrdersSchema = z.object({
  supplierId: z.coerce.number({
    invalid_type_error: "Supplier ID must be a number",
    required_error: "Supplier ID is required",
  }),
  expectedAt: z.coerce.date({
    invalid_type_error: "Expected at date is invalid",
    required_error: "Expected at date is required",
  }),
  notes: z.string().min(1, { message: "Notes are required" }),
  items: z
    .array(purchaseOrderItemSchema, {
      invalid_type_error: "Items must be an array",
      required_error: "At least one item is required",
    })
    .min(1, {
      message: "At least one item is required for the purchase order",
    }),
});

export type TPurchaseOrderSchema = z.infer<typeof purchaseOrdersSchema>;
export type TPurchaseOrderItemSchema = z.infer<typeof purchaseOrderItemSchema>;
