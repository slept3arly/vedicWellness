import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function createUserDB(data: any) {
  return prisma.user.create({
    data,
    select: { id: true, email: true, role: true },
  });
}

export async function updateUserDB(id: string, data: any) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUserDB(id: string) {
  return prisma.user.delete({ where: { id } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

/* ✅ Admin reads */

export async function getAdminUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}
