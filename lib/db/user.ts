import "server-only";
import { prisma } from "@/lib/db/prisma";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";

/* =========================================================
   TYPES
========================================================= */

export type CreateUserInput = Prisma.UserCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;

/* =========================================================
   CREATE
========================================================= */

export async function createUserDB(data: CreateUserInput) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}

/* =========================================================
   UPDATE
========================================================= */

export async function updateUserDB(
  id: string,
  data: UpdateUserInput
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

/* =========================================================
   SOFT DELETE + ANONYMIZE
========================================================= */

export async function deleteUserDB(id: string) {
  const deletedEmail = `deleted-${Date.now()}-${randomUUID()}@deleted.local`;

  return prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),

      email: deletedEmail,
      name: "Deleted User",
      phone: null,
      password: randomUUID(),
      verified: false,
      verifiedAt: null,
    },
  });
}

/* =========================================================
   READ SINGLE USER (SAFE)
========================================================= */

export async function getUserById(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      verified: true,
      createdAt: true,
    },
  });
}

/* =========================================================
   ADMIN USERS LIST (SAFE + PAGINATED)
========================================================= */

export async function getAdminUsers(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(q && {
      OR: [
        {
          email: {
            contains: q,
            mode: "insensitive" as const,
          },
        },
        {
          name: {
            contains: q,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

/* =========================================================
   ADMIN READ SINGLE USER
========================================================= */

export async function getAdminUserById(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      verified: true,
      createdAt: true,
    },
  });
}