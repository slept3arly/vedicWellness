import "server-only";
import { prisma } from "@/lib/db/prisma";
import { randomUUID } from "crypto";

/* ===============================
   CREATE
================================ */
export async function createUserDB(data: any) {
  return prisma.user.create({
    data,
    select: { id: true, email: true, role: true },
  });
}

/* ===============================
   UPDATE
================================ */
export async function updateUserDB(id: string, data: any) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

/* ===============================
   SOFT DELETE + ANONYMIZE
================================ */
export async function deleteUserDB(id: string) {
  const deletedEmail = `deleted-${Date.now()}-${randomUUID()}@deleted.local`;

  return prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),

      // 🔐 anonymize personal info
      email: deletedEmail,
      name: "Deleted User",
      phone: null,
      password: randomUUID(), // invalidate login
      verified: false,
      verifiedAt: null,
    },
  });
}

/* ===============================
   READ SINGLE USER
================================ */
export async function getUserById(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null, // ⭐ hide deleted users
    },
  });
}

/* ===============================
   ADMIN USERS LIST
================================ */
export async function getAdminUsers(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  return prisma.user.findMany({
    where: {
      deletedAt: null, // ⭐ hide deleted users

      ...(q && {
        OR: [
          {
            email: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      }),
    },

    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
}
