"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertSameOriginAction } from "@/lib/security/csrf";

import {
  createUserService,
  updateUserRoleService,
  updateUserService,
  deleteUserService,
} from "@/lib/services/userService";

import { parseDeleteUser } from "@/lib/validators/user";

export async function createUser(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await createUserService(formData, admin.id);

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await updateUserRoleService(formData, admin.id);

  revalidatePath("/admin/users");
}

export async function updateUser(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await updateUserService(formData, admin.id);

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const { id } = parseDeleteUser(formData);

  await deleteUserService(id, admin.id);

  revalidatePath("/admin/users");
}
