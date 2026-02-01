import bcrypt from "bcryptjs";
import {
  createUserDB,
  updateUserDB,
  deleteUserDB,
  getUserById,
} from "@/lib/db/user";

import { auditWithContext } from "@/lib/observability/auditWithContext";
import { headers } from "next/headers";

import {
  parseCreateUser,
  parseUpdateUser,
  parseUpdateUserRole,
} from "@/lib/validators/user";

async function getRequestContext() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

export async function createUserService(
  formData: FormData,
  adminId: string
) {
  const data = parseCreateUser(formData);

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await createUserDB({
    email: data.email,
    password: hashed,
    role: data.role,
  });

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "USER",
    entityId: user.id,
    ...ctx,
    metadata: { email: user.email, role: user.role },
  });

  return user.id;
}

export async function updateUserRoleService(
  formData: FormData,
  adminId: string
) {
  const { id, role } = parseUpdateUserRole(formData);

  const old = await getUserById(id);

  await updateUserDB(id, { role });

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ROLE_CHANGE",
    entityType: "USER",
    entityId: id,
    ...ctx,
    metadata: { from: old?.role ?? null, to: role },
  });
}

export async function updateUserService(
  formData: FormData,
  adminId: string
) {
  const data = parseUpdateUser(formData);

  const old = await getUserById(data.id);

  const updateData: any = {
    email: data.email,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await updateUserDB(data.id, updateData);

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "USER",
    entityId: data.id,
    ...ctx,
    metadata: {
      from: { email: old?.email ?? null, role: old?.role ?? null },
      to: { email: data.email, role: data.role },
      passwordChanged: Boolean(data.password),
    },
  });
}

export async function deleteUserService(
  id: string,
  adminId: string
) {
  const user = await getUserById(id);

  await deleteUserDB(id);

  const ctx = await getRequestContext();
   await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "USER",
    entityId: id,
    ...ctx,
    metadata: { email: user?.email ?? null, role: user?.role ?? null },
  });
}
