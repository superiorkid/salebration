import { z } from "zod";

const baseUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string(),
  role: z.coerce.number({
    invalid_type_error: "Role must be a number",
    required_error: "Role is required",
  }),
});

export const userSchema = baseUserSchema.superRefine((val, ctx) => {
  if (val.password !== val.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords do not match",
      path: ["confirmPassword"],
    });
  }
});

export const updatePasswordSchema = baseUserSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
export const editUserSchema = baseUserSchema.omit({
  password: true,
  confirmPassword: true,
});

export type TUserSchema = z.infer<typeof userSchema>;
export type TUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type TEditUserSchema = z.infer<typeof editUserSchema>;
