import { z } from "zod";

export const validateOrderTokenSchema = z.object({
  orderId: z.coerce.number({
    invalid_type_error: "Order ID must be a number",
    required_error: "Order ID is required",
  }),
  token: z.string().min(1, { message: "Token is required" }),
  type: z.enum(["purchase-order", "reorder"], {
    invalid_type_error: "Invalid order type",
    required_error: "Order type is required",
  }),
});

export type TValidateOrderToken = z.infer<typeof validateOrderTokenSchema>;
