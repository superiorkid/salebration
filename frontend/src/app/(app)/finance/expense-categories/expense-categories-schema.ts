import { z } from "zod";

export const expenseCategoriesSchema = z.object({
  name: z.string().min(1, { message: "category name is required" }),
});

export type TExpenseCategoriesSchema = z.infer<typeof expenseCategoriesSchema>;
