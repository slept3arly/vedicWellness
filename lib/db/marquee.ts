import "server-only";
import { buildWhere } from "@/lib/db/search";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import type { SearchConfig } from "@/lib/db/search";

const marqueeSearchConfig: SearchConfig = {
  text: ["text"],
  enum: [],
  relation: [],
  exact: [],
};

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
  q = "",
  filters: {
    status?: "ACTIVE" | "INACTIVE" | "";
  } = {}
) {
  const skip = (page - 1) * limit;
  const searchWhere = buildWhere(q, marqueeSearchConfig) as Prisma.MarqueeItemWhereInput;
  const filterConditions: Prisma.MarqueeItemWhereInput[] = [];

  if (filters.status === "ACTIVE") {
    filterConditions.push({ isActive: true });
  }

  if (filters.status === "INACTIVE") {
    filterConditions.push({ isActive: false });
  }

  const where =
    filterConditions.length > 0
      ? {
          AND: [searchWhere, ...filterConditions],
        }
      : searchWhere;

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
