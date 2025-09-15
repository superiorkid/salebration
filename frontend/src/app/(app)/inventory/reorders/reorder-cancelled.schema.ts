import { z } from "zod";

export const reorderCancelledSchema = z.object({
  cancellationReason: z
    .string()
    .min(1, { message: "Cancellation reason is required." }),
});

export type TReorderCancelled = z.infer<typeof reorderCancelledSchema>;
