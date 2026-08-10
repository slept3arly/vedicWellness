import "server-only";
import { buildWhere } from "@/lib/db/search";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { normalizePagination } from "@/lib/db/pagination";
import { Prisma } from "@prisma/client";
import type { SearchConfig } from "@/lib/db/search";

/* ========================================================= */
/* TYPES */
/* ========================================================= */

const bannerSelect = {
  id: true,
  title: true,
  message: true,
  type: true,
  imageUrl: true,
  buttonText: true,
  buttonLink: true,
  isActive: true,
  startAt: true,
  endAt: true,
  createdAt: true,
} as const;

const bannerSearchConfig: SearchConfig = {
  text: ["title", "message"],
  enum: [],
  relation: [],
  exact: [],
};

/* ========================================================= */
/* CREATE */
/* ========================================================= */

export async function createBannerDB(data: Prisma.BannerCreateInput) {
  return prisma.banner.create({
    data,
    select: { id: true },
  });
}

/* ========================================================= */
/* UPDATE */
/* ========================================================= */

export async function updateBannerDB(id: string, data: Prisma.BannerUpdateInput) {
  return prisma.banner.update({
    where: { id },
    data,
    select: { id: true },
  });
}

/* ========================================================= */
/* DELETE */
/* ========================================================= */

export async function deleteBannerDB(id: string) {
  return prisma.banner.delete({
    where: { id },
    select: { id: true },
  });
}

/* ========================================================= */
/* GET SINGLE */
/* ========================================================= */

export async function getBannerById(id: string) {
  return prisma.banner.findUnique({
    where: { id },
    select: bannerSelect,
  });
}

/* ========================================================= */
/* PUBLIC: ACTIVE BANNER */
/* ========================================================= */

export async function getActiveBanner() {
  const now = new Date();

  return prisma.banner.findFirst({
    where: {
      isActive: true,
      OR: [
        { startAt: null, endAt: null },
        { startAt: { lte: now }, endAt: null },
        { startAt: null, endAt: { gte: now } },
        { startAt: { lte: now }, endAt: { gte: now } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    select: bannerSelect,
  });
}

/* ========================================================= */
/* ADMIN: LIST (PAGINATED + SEARCH) */
/* ========================================================= */

export async function getAdminBanners(
  page = 1,
  limit = ADMIN_PAGE_SIZE,
  q = "",
  filters: {
    status?: "ACTIVE" | "INACTIVE" | "";
  } = {}
) {
  const pagination = normalizePagination(page, limit, ADMIN_PAGE_SIZE);
  page = pagination.page;
  limit = pagination.limit;
  const skip = (page - 1) * limit;
  const searchWhere = buildWhere(q, bannerSearchConfig) as Prisma.BannerWhereInput;
  const filterConditions: Prisma.BannerWhereInput[] = [];

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
    prisma.banner.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: bannerSelect,
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

/* ========================================================= */
/* ADMIN READ SINGLE                                         */
/* ========================================================= */

export async function getAdminBannerById(id: string) {
  return prisma.banner.findFirst({
    where: { id },
    select: bannerSelect,
  });
}
