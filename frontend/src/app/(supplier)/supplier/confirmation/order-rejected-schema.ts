import { z } from "zod";

export const orderRejectedSchema = z.object({
  rejection_reason: z
    .string()
    .min(1, { message: "Rejection reason is required" }),
});

export type TOrderRejected = z.infer<typeof orderRejectedSchema>;
