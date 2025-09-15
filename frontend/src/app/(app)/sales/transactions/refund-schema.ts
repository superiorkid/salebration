import { z } from "zod";

export const refundSchema = z.object({
  // saleId: z.coerce.number(),
  reason: z.string().optional(),
});

export type TRefund = z.infer<typeof refundSchema>;
