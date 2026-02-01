import bcrypt from "bcryptjs";

import {
  createUserDB,
  updateUserDB,
  deleteUserDB,
  getUserById,
} from "@/lib/db/user";

import { auditWithContext } from "@/lib/observability/auditWithContext";

import {
  parseCreateUser,
  parseUpdateUser,
  parseUpdateUserRole,
} from "@/lib/validators/user";

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

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "USER",
    entityId: user.id,
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

  await auditWithContext({
    actorId: adminId,
    action: "ROLE_CHANGE",
    entityType: "USER",
    entityId: id,
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

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "USER",
    entityId: data.id,
    metadata: {
      from: { email: old?.email ?? null, role: old?.role ?? null },
      to: { email: data.email, role: data.role },
      passwordChanged: Boolean(data.password),
    },
  });
}

export async function deleteUserService(id: string, adminId: string) {
  const user = await getUserById(id);

  await deleteUserDB(id);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "USER",
    entityId: id,
    metadata: { email: user?.email ?? null, role: user?.role ?? null },
  });
}
