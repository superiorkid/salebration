import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/avif",
];

const productVariantSchema = z.object({
  id: z.coerce.number().optional(),
  attribute: z
    .string()
    .min(1, { message: "Product variant attribute name is required" })
    .max(50, { message: "Attribute name cannot exceed 50 characters" }),
  value: z
    .string()
    .min(1, { message: "Product variant value is required" })
    .max(50, { message: "Variant value cannot exceed 50 characters" }),
  skuSuffix: z
    .string()
    .min(1, { message: "Product SKU suffix is required" })
    .max(20, { message: "SKU suffix cannot exceed 20 characters" }),
  barcode: z
    .string()
    .max(50, { message: "Barcode cannot exceed 50 characters" })
    .nullable()
    .optional(),
  additionalPrice: z.coerce
    .number()
    .min(0, { message: "Additional price cannot be negative" }),
  sellingPrice: z.coerce
    .number()
    .min(0, { message: "Selling price cannot be negative" }),
  quantity: z.coerce
    .number()
    .min(0, { message: "Quantity cannot be negative" })
    .int({ message: "Quantity must be a whole number" }),
  minStockLevel: z.coerce
    .number()
    .min(0, { message: "Minimum stock level cannot be negative" })
    .int({ message: "Minimum stock level must be a whole number" }),
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => {
          return !file || file.size <= MAX_UPLOAD_SIZE;
        }, "File size must be less than 2MB")
        .refine((file) => {
          return ACCEPTED_FILE_TYPES.includes(file.type);
        }, "File must be a PNG, JPG, JPEG, WEBP"),
      z.string(),
    ])
    .optional(),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Product name is required" })
    .max(100, { message: "Product name cannot exceed 100 characters" }),
  sku: z
    .string()
    .min(1, { message: "Product SKU is required" })
    .max(30, { message: "SKU cannot exceed 30 characters" })
    .regex(/^[A-Za-z0-9-_]+$/, {
      message: "SKU can only contain letters, numbers, hyphens and underscores",
    }),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
  categoryId: z.string().min(1, { message: "Product category is required" }),
  supplierId: z.string().min(1, { message: "Product supplier is required" }),
  basePrice: z.coerce
    .number()
    .min(0, { message: "Cost price cannot be negative" }),
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => {
          return !file || file.size <= MAX_UPLOAD_SIZE;
        }, "File size must be less than 2MB")
        .refine((file) => {
          return ACCEPTED_FILE_TYPES.includes(file.type);
        }, "File must be a PNG, JPG, JPEG, WEBP"),
      z.string(),
    ])
    .optional(),
  isActive: z.boolean(),

  productVariantHelpers: z
    .array(
      z.object({
        key: z.string().min(1, { message: "Variant key is required" }),
        values: z
          .array(z.string().min(1, { message: "Variant value is required" }))
          .min(1, { message: "At least one variant value is required" }),
      }),
    )
    .optional(),
  productVariants: z.array(productVariantSchema).min(1, {
    message: "At least one product variant configuration is required",
  }),
});

export type Product = z.infer<typeof productSchema>;
export type TProductVariantSchema = z.infer<typeof productVariantSchema>;
