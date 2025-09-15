import { z } from "zod";

export const auditSchema = z.object({
  countedQuantity: z.coerce
    .number({
      invalid_type_error: "Counted quantity must be a number",
      required_error: "Counted quantity is required",
    })
    .nonnegative({
      message: "Counted quantity cannot be negative",
    }),
  notes: z.string().min(1, { message: "Notes are required" }),
});

export type TAuditSchema = z.infer<typeof auditSchema>;
