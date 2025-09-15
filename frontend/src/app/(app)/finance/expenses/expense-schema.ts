import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const baseSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title cannot exceed 255 characters" })
    .trim(),
  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters" })
    .optional(),
  category_id: z.coerce
    .number({ invalid_type_error: "Category ID must be a number" })
    .int("Category ID must be an integer")
    .min(1, { message: "Category ID must be a positive number" }),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be a positive number"),
  paid_at: z.coerce.date({
    invalid_type_error: "Paid date must be a valid date",
  }),
});

export const createExpenseSchema = baseSchema.extend({
  images: z
    .array(
      z
        .instanceof(File, { message: "Please upload a valid file" })
        .refine(
          (file) => file.size <= MAX_UPLOAD_SIZE,
          `File size must be less than ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB`,
        )
        .refine(
          (file) => ACCEPTED_FILE_TYPES.includes(file.type),
          `Invalid file type. Accepted types are: ${ACCEPTED_FILE_TYPES.join(", ")}`,
        ),
    )
    .optional(),
});

export const editExpenseSchema = baseSchema.extend({
  new_images: z
    .array(
      z
        .instanceof(File, { message: "Please upload a valid file" })
        .refine(
          (file) => file.size <= MAX_UPLOAD_SIZE,
          `File size must be less than ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB`,
        )
        .refine(
          (file) => ACCEPTED_FILE_TYPES.includes(file.type),
          `Invalid file type. Accepted types are: ${ACCEPTED_FILE_TYPES.join(", ")}`,
        ),
    )
    .optional(),
  keep_images: z.coerce.number().array().optional(),
  delete_images: z.coerce.number().array().optional(),
});

export type TCreateExpenseSchema = z.infer<typeof createExpenseSchema>;
export type TEditExpenseSchema = z.infer<typeof editExpenseSchema>;
