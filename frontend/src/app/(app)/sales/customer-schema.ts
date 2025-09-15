import { z } from "zod";

export const customerSchema = z
  .object({
    name: z.string().min(1, { message: "Customer name is required" }),
    companyName: z.string().optional(),
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .optional()
      .or(z.literal(""))
      .transform((e) => (e === "" ? undefined : e)),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one contact method is required - please provide either an email or phone number",
        path: ["email"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one contact method is required - please provide either an email or phone number",
        path: ["phone"],
      });
    }
  });

export type TCustomer = z.infer<typeof customerSchema>;
