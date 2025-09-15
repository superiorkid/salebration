import libphonenumber from "google-libphonenumber";
import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/avif",
];

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export const supplierSchema = z.object({
  name: z.string().min(1, { message: "Supplier name is required" }),
  email: z.string().email({
    message: "Please enter a valid email address (e.g., example@domain.com)",
  }),
  phone: z
    .string()
    .optional()
    .refine(
      (number) => {
        if (!number) return true;
        try {
          const phoneNumber = phoneUtil.parseAndKeepRawInput(number);
          return phoneUtil.isValidNumber(phoneNumber);
        } catch {
          return false;
        }
      },
      {
        message:
          "Please enter a valid international phone number (e.g., +1 234 567 8900)",
      },
    ),
  address: z
    .string()
    .max(255, { message: "Address cannot exceed 255 characters" })
    .optional(),
  status: z.boolean({
    required_error: "Please indicate whether this supplier is active",
    invalid_type_error: "Active status must be either true or false",
  }),
  profile_image: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => !file || file.size <= MAX_UPLOAD_SIZE,
          `Maximum file size is ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`,
        )
        .refine(
          (file) => ACCEPTED_FILE_TYPES.includes(file.type),
          `Only ${ACCEPTED_FILE_TYPES.map((t) => t.split("/")[1]).join(", ")} files are accepted`,
        ),
      z.string().url().optional(),
    ])
    .optional()
    .describe("Supplier logo or profile picture"),
});

export type Supplier = z.infer<typeof supplierSchema>;
