import { z } from "zod";

export const orderAcceptedSchema = z.object({
  acceptance_notes: z
    .string()
    .min(1, { message: "Acceptance notes is required" }),
});

export type TOrderAccepted = z.infer<typeof orderAcceptedSchema>;
