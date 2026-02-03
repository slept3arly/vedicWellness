"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createUserService,
  updateUserRoleService,
  updateUserService,
  deleteUserService,
} from "@/lib/services/userService";

import { parseDeleteUser } from "@/lib/validators/user";

export const createUser = secureAdminAction(
  async (admin, formData: FormData) => {
    await createUserService(formData, admin.id);

    revalidatePath("/admin/users");
    redirect("/admin/users");
  }
);

export const updateUserRole = secureAdminAction(
  async (admin, formData: FormData) => {
    await updateUserRoleService(formData, admin.id);

    revalidatePath("/admin/users");
  }
);

export const updateUser = secureAdminAction(
  async (admin, formData: FormData) => {
    await updateUserService(formData, admin.id);

    revalidatePath("/admin/users");
    redirect("/admin/users");
  }
);

export const deleteUser = secureAdminAction(
  async (admin, formData: FormData) => {
    const { id } = parseDeleteUser(formData);

    await deleteUserService(id, admin.id);

    revalidatePath("/admin/users");
  }
);
