import bcrypt from "bcryptjs";
import {
  createUserDB,
  updateUserDB,
  deleteUserDB,
  getUserById,
} from "@/lib/db/user";

import { auditWithContext } from "@/lib/observability/auditWithContext";
import { Prisma, Role } from "@prisma/client";

/* =========================================================
   TYPES
========================================================= */

type CreateUserInput = {
  email: string;
  password: string;
  role: Role;
  verified?: boolean; // ✅ add this
};

type UpdateUserInput = {
  id: string;
  email: string;
  role: Role;
  password?: string;
  verified?: boolean; // ✅ add
};

/* =========================================================
   CREATE
========================================================= */

export async function createUserService(
  data: CreateUserInput,
  adminId: string
) {
  const hashed = await bcrypt.hash(data.password, 10);

  const isVerified = data.verified === true;

  const user = await createUserDB({
    email: data.email,
    password: hashed,
    role: data.role,

    // ✅ enforce invariant
    verified: isVerified,
    verifiedAt: isVerified ? new Date() : null,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "USER",
    entityId: user.id,
    entityLabel: `User: ${user.email}`,
    metadata: {
      type: "CREATE",
      snapshot: {
        email: user.email,
        role: user.role,
        verified: isVerified, // ✅ include this
      },
    },
  });

  return user.id;
}

/* =========================================================
   ROLE UPDATE
========================================================= */

export async function updateUserRoleService(
  id: string,
  role: Role,
  adminId: string
) {
  const old = await getUserById(id);
  if (!old) return;

  await updateUserDB(id, { role });

  await auditWithContext({
    actorId: adminId,
    action: "ROLE_CHANGE",
    entityType: "USER",
    entityId: id,
    entityLabel: `User: ${old.email}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "role",
          from: old.role,
          to: role,
        },
      ],
    },
  });
}

/* =========================================================
   UPDATE
========================================================= */

export async function updateUserService(
  data: UpdateUserInput,
  adminId: string
) {
  const old = await getUserById(data.id);
  if (!old) return;

const updateData: Prisma.UserUpdateInput = {
  email: data.email,
  role: data.role,
};

const isVerified = data.verified === true;

// ✅ enforce invariant
updateData.verified = isVerified;
updateData.verifiedAt = isVerified ? new Date() : null;

if (data.password) {
  updateData.password = await bcrypt.hash(data.password, 10);
}

  await updateUserDB(data.id, updateData);

  const changes = [];

  if (old.email !== data.email) {
    changes.push({
      field: "email",
      from: old.email,
      to: data.email,
    });
  }

  if (old.role !== data.role) {
    changes.push({
      field: "role",
      from: old.role,
      to: data.role,
    });
  }

  if (data.password) {
    changes.push({
      field: "password",
      from: "hidden",
      to: "updated",
    });
  }

  if (old.verified !== isVerified) {
  changes.push({
    field: "verified",
    from: old.verified,
    to: isVerified,
  });
}

  // ✅ avoid empty logs
  if (changes.length === 0) return;

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "USER",
    entityId: data.id,
    entityLabel: `User: ${data.email}`, // ✅ use NEW value
    metadata: {
      type: "UPDATE",
      changes,
    },
  });
}

/* =========================================================
   DELETE
========================================================= */

export async function deleteUserService(
  id: string,
  adminId: string
) {
  const user = await getUserById(id);

  await deleteUserDB(id);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "USER",
    entityId: id,
    entityLabel: `User: ${user?.email ?? "Unknown"}`,
    metadata: {
      type: "DELETE",
      snapshot: {
        email: user?.email ?? null,
        role: user?.role ?? null,
      },
    },
  });
}