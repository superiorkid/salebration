import { z } from "zod";

export const purchaseOrderCancellededSchema = z.object({
  cancellation_reason: z
    .string()
    .min(1, { message: "Cancellation reason is required" }),
});

export type TPurchaseOrderCancelled = z.infer<
  typeof purchaseOrderCancellededSchema
>;
