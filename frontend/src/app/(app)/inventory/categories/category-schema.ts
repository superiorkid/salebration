import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category Name is Required." })
    .trim()
    .toLowerCase(),
  description: z.string().optional(),
  parentId: z.coerce
    .number({
      invalid_type_error: "Parent ID must be a number",
      required_error: "Parent ID is required",
    })
    .optional(),
});

export type Category = z.infer<typeof categorySchema>;
