"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createUserService,
  updateUserRoleService,
  updateUserService,
  deleteUserService,
} from "@/lib/services/admin/userService";

import {
  parseCreateUser,
  parseUpdateUser,
  parseUpdateUserRole,
  parseDeleteUser,
} from "@/lib/validators/user";

/* =========================================================
   CREATE
========================================================= */

export const createUser = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseCreateUser(formData);

    await createUserService(data, admin.id);

    revalidateTag("users", "max");
    redirect("/admin/users");
  }
);

/* =========================================================
   ROLE UPDATE
========================================================= */

export const updateUserRole = secureAdminAction(
  async (admin, formData: FormData) => {
    const { id, role } = parseUpdateUserRole(formData);

    await updateUserRoleService(id, role, admin.id);

    revalidateTag("users", "max");
  }
);

/* =========================================================
   UPDATE
========================================================= */

export const updateUser = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseUpdateUser(formData);

    await updateUserService(data, admin.id);

    revalidateTag("users", "max");
    redirect("/admin/users");
  }
);

/* =========================================================
   DELETE
========================================================= */

export const deleteUser = secureAdminAction(
  async (admin, formData: FormData) => {
    const { id } = parseDeleteUser(formData);

    await deleteUserService(id, admin.id);

    revalidateTag("users", "max");
  }
);