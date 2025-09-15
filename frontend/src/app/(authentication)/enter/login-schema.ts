import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters long")
    .max(320, "Email cannot exceed 320 characters")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters"),
  rememberMe: z.boolean().default(false).optional(),
});

export type TLogin = z.infer<typeof loginSchema>;
