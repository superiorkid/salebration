import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

export const companySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Company name is required" })
    .max(255, { message: "Company name cannot exceed 255 characters" })
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address")
    .max(320, "Email cannot exceed 320 characters")
    .transform((val) => val.trim().toLowerCase()),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number cannot exceed 20 characters" })
    .trim(),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(500, { message: "Address cannot exceed 500 characters" })
    .trim(),
  display_name: z
    .string()
    .min(1, { message: "Display name is required" })
    .max(255, { message: "Display name cannot exceed 255 characters" })
    .trim(),
  website: z
    .string()
    .url("Please enter a valid URL for the website")
    .max(2048, { message: "Website URL cannot exceed 2048 characters" })
    .trim()
    .optional(),
  owner_name: z
    .string()
    .max(255, { message: "Owner name cannot exceed 255 characters" })
    .trim()
    .optional(),
  logo: z
    .instanceof(File, { message: "Please upload a valid file for the logo" })
    .refine(
      (file) => file.size <= MAX_UPLOAD_SIZE,
      `Logo file size must be less than ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB`,
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      `Invalid logo file type. Accepted types are: ${ACCEPTED_FILE_TYPES.join(", ")}`,
    )
    .optional(),
});
export type TCompanySchema = z.infer<typeof companySchema>;
