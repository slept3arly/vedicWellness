import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "SALES", "VIEWER"]);

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: UserRoleSchema,

  // ✅ add this
  verified: z.boolean().optional(),
});

export const UpdateUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  password: z.string().optional(),
  role: UserRoleSchema,

  verified: z.boolean().optional(), // ✅ add
});

export const UpdateUserRoleSchema = z.object({
  id: z.string().min(1),
  role: UserRoleSchema,
});

export const DeleteUserSchema = z.object({
  id: z.string().min(1),
});

export function parseCreateUser(formData: FormData) {
  return CreateUserSchema.parse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "VIEWER"),

    // ✅ checkbox → boolean
    verified: formData.get("verified") === "on",
  });
}

export function parseUpdateUser(formData: FormData) {
  return UpdateUserSchema.parse({
    id: String(formData.get("id") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? "") || undefined,
    role: String(formData.get("role") ?? "VIEWER"),

    // ✅ checkbox handling
    verified: formData.get("verified") === "on",
  });
}

export function parseUpdateUserRole(formData: FormData) {
  return UpdateUserRoleSchema.parse({
    id: String(formData.get("id") ?? "").trim(),
    role: String(formData.get("role") ?? "VIEWER"),
  });
}

export function parseDeleteUser(formData: FormData) {
  return DeleteUserSchema.parse({
    id: String(formData.get("id") ?? "").trim(),
  });
}
