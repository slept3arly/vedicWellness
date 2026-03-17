import "server-only";
import { prisma } from "@/lib/db/prisma";

/* Create Banner */

export async function createBannerDB(data: any) {
  return prisma.banner.create({
    data,
    select: { id: true },
  });
}

/* Update Banner */

export async function updateBannerDB(id: string, data: any) {
  return prisma.banner.update({
    where: { id },
    data,
  });
}

/* Delete Banner */

export async function deleteBannerDB(id: string) {
  return prisma.banner.delete({
    where: { id },
  });
}

/* Get Single Banner */

export async function getBannerById(id: string) {
  return prisma.banner.findUnique({
    where: { id },
  });
}

/* Get Active Banner (Public API use) */

export async function getActiveBanner() {
  const now = new Date();

  return prisma.banner.findFirst({
    where: {
      isActive: true,
      OR: [
        {
          startAt: null,
          endAt: null,
        },
        {
          startAt: { lte: now },
          endAt: null,
        },
        {
          startAt: null,
          endAt: { gte: now },
        },
        {
          startAt: { lte: now },
          endAt: { gte: now },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* Admin List (Paginated + Search) */

export async function getAdminBanners(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          {
            title: {
              contains: q,
              mode: "insensitive" as const,
            },
          },
          {
            message: {
              contains: q,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.banner.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.banner.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}