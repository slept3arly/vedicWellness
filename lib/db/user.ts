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

/* ✅ Admin reads (paginated) */
export async function getAdminUsers(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  return prisma.user.findMany({
    where: q
      ? {
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
        }
      : undefined,

    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
}

