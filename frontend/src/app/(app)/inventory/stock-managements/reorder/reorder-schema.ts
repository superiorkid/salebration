import { z } from "zod";

export const reorderSchema = z.object({
  quantity: z.coerce
    .number()
    .positive("Quantity must be at least 1")
    .max(10000, "Maximum order is 10,000 units"),
  expectedDeliveryDate: z.coerce
    .date()
    .min(new Date(), "Date cannot be in past"),
  notes: z.string().max(500).optional(),
});

export type TReorder = z.infer<typeof reorderSchema>;
export type TReorderWithVariantId = TReorder & { productVariantId: number };
