import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Role name is required" })
    .max(100, { message: "Role name cannot exceed 100 characters" })
    .trim(),
  permissions: z
    .array(z.string())
    .min(1, { message: "At least one permission is required for a role" }),
});
export type TRoleSchema = z.infer<typeof roleSchema>;
