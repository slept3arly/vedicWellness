import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "SALES", "VIEWER"]);

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: UserRoleSchema,
});

export const UpdateUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  password: z.string().optional(),
  role: UserRoleSchema,
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
  });
}

export function parseUpdateUser(formData: FormData) {
  return UpdateUserSchema.parse({
    id: String(formData.get("id") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? "") || undefined,
    role: String(formData.get("role") ?? "VIEWER"),
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
