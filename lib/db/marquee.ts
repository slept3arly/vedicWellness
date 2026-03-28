import "server-only";
import { prisma } from "@/lib/db/prisma";

/* ──────────────────────────────── */
/* Create */
/* ──────────────────────────────── */

export async function createMarqueeDB(data: {
  text: string;
  order: number;
  isActive: boolean;
}) {
  return prisma.marqueeItem.create({
    data,
    select: { id: true },
  });
}

/* ──────────────────────────────── */
/* Update */
/* ──────────────────────────────── */

export async function updateMarqueeDB(
  id: string,
  data: {
    text?: string;
    order?: number;
    isActive?: boolean;
  }
) {
  return prisma.marqueeItem.update({
    where: { id },
    data,
  });
}

/* ──────────────────────────────── */
/* Delete */
/* ──────────────────────────────── */

export async function deleteMarqueeDB(id: string) {
  return prisma.marqueeItem.delete({
    where: { id },
  });
}

/* ──────────────────────────────── */
/* Single */
/* ──────────────────────────────── */

export async function getMarqueeById(id: string) {
  return prisma.marqueeItem.findUnique({
    where: { id },
    select: {
      id: true,
      text: true,
      order: true,
      isActive: true,
    },
  });
}

/* ──────────────────────────────── */
/* Admin Reads (STRICT) */
/* ──────────────────────────────── */

export async function getAdminMarqueeItems(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  const where = q
    ? {
        text: {
          contains: q,
          mode: "insensitive" as const,
        },
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.marqueeItem.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
      skip,
      take: limit,
      select: {
        id: true,
        text: true,
        order: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.marqueeItem.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

/* ──────────────────────────────── */
/* Public Reads (ACTIVE ONLY) */
/* ──────────────────────────────── */

export async function getActiveMarqueeItems() {
  return prisma.marqueeItem.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      text: true,
    },
  });
}

/* ──────────────────────────────── */
/* ADMIN READ SINGLE */
/* ──────────────────────────────── */

export async function getAdminMarqueeItemById(id: string) {
  return prisma.marqueeItem.findFirst({
    where: { id },
  });
}