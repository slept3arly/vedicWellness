import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function createMarqueeDB(data: any) {
  return prisma.marqueeItem.create({
    data,
    select: { id: true },
  });
}

export async function updateMarqueeDB(id: string, data: any) {
  return prisma.marqueeItem.update({
    where: { id },
    data,
  });
}

export async function deleteMarqueeDB(id: string) {
  return prisma.marqueeItem.delete({ where: { id } });
}

export async function getMarqueeById(id: string) {
  return prisma.marqueeItem.findUnique({ where: { id } });
}

/* ✅ Admin reads (paginated) */
export async function getAdminMarqueeItems(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  return prisma.marqueeItem.findMany({
    where: q
      ? {
          text: {
            contains: q,
            mode: "insensitive",
          },
        }
      : undefined,
    // Sorts by your custom order first, then by newest
    orderBy: [
      { order: "asc" }, 
      { createdAt: "desc" }
    ],
    skip,
    take: limit,
  });
}
