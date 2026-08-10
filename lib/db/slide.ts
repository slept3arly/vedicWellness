import "server-only";
import { buildWhere } from "@/lib/db/search";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { normalizePagination } from "@/lib/db/pagination";
import { PlacementKey, Prisma } from "@prisma/client";
import type { SearchConfig, SearchWhereClause, SearchWhereInput } from "@/lib/db/search";

/* ===============================
   EXPORTED TYPES
================================ */

export type SlideListItem = Prisma.SlideGetPayload<{
  select: {
    id: true;
    imageDesktopUrl: true;
    imageMobileUrl: true;
    createdAt: true;
    placements: {
      select: {
        id: true;
        placementKey: true;
        order: true;
        isActive: true;
        startAt: true;
        endAt: true;
      };
    };
  };
}>;

/* ===============================
   TYPES
================================ */

export type SlidePlacementInput = {
  placementKey: PlacementKey;
  order: number;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
};

const slideSearchConfig: SearchConfig = {
  text: [],
  enum: [
    {
      path: "placementKey",
      values: Object.values(PlacementKey),
    },
  ],
  relation: [],
  exact: [],
};

function hasSearchConditions(searchWhere: SearchWhereInput) {
  return searchWhere.AND?.every((clause) => {
    const orClauses = clause.OR;

    return Array.isArray(orClauses) && orClauses.length > 0;
  }) ?? false;
}

function nestPlacementClause(clause: SearchWhereClause): SearchWhereClause {
  return {
    placements: {
      some: clause,
    },
  };
}

function buildSlideWhere(q: string): SearchWhereInput {
  const searchWhere = buildWhere(q, slideSearchConfig);

  if (!q.trim()) {
    return {};
  }

  if (!hasSearchConditions(searchWhere)) {
    return {
      id: "__NO_MATCH__",
    };
  }

  return {
    AND: searchWhere.AND?.map((clause) => {
      const orClauses = Array.isArray(clause.OR)
        ? (clause.OR as SearchWhereClause[])
        : [];

      return {
        OR: orClauses.map((orClause: SearchWhereClause) =>
          nestPlacementClause(orClause)
        ),
      };
    }),
  };
}

/* ===============================
   CREATE
================================ */

export async function createSlideDB(data: {
  imageDesktopUrl: string;
  imageMobileUrl: string;
}) {
  return prisma.slide.create({
    data,
    select: { id: true },
  });
}

/* ===============================
   CREATE PLACEMENT
================================ */

export async function createSlidePlacementDB(data: {
  slideId: string;
  placementKey: PlacementKey;
  order: number;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
}) {
  return prisma.slidePlacement.create({
    data,
    select: { id: true },
  });
}

/* ===============================
   UPDATE
================================ */

export async function updateSlideDB(
  id: string,
  data: {
    imageDesktopUrl: string;
    imageMobileUrl: string;
  }
) {
  return prisma.slide.update({
    where: { id },
    data,
    select: { id: true },
  });
}

/* ===============================
   REPLACE PLACEMENTS
================================ */

export async function replaceSlidePlacementsDB(
  slideId: string,
  placements: SlidePlacementInput[]
) {
  await prisma.$transaction([
    prisma.slidePlacement.deleteMany({
      where: { slideId },
    }),
    prisma.slidePlacement.createMany({
      data: placements.map((p) => ({
        slideId,
        placementKey: p.placementKey,
        order: p.order,
        isActive: p.isActive,
        startAt: p.startAt,
        endAt: p.endAt,
      })),
    }),
  ]);
}

/* ===============================
   DELETE
================================ */

export async function deleteSlideDB(id: string) {
  return prisma.slide.delete({
    where: { id },
    select: { id: true },
  });
}

/* ===============================
   GET BY ID (FOR AUDIT + EDIT)
================================ */

export async function getSlideById(id: string) {
  return prisma.slide.findUnique({
    where: { id },
    select: {
      id: true,
      imageDesktopUrl: true,
      imageMobileUrl: true,
      placements: {
        select: {
          id: true,
          placementKey: true,
          order: true,
          isActive: true,
          startAt: true,
          endAt: true,
        },
      },
    },
  });
}

/* ===============================
   ADMIN LIST (PAGINATED)
================================ */

export async function getAdminSlides(
  page = 1,
  limit = ADMIN_PAGE_SIZE,
  q = "",
  filters: {
    status?: "ACTIVE" | "INACTIVE" | "";
    type?: PlacementKey | "";
  } = {}
) {
  const pagination = normalizePagination(page, limit, ADMIN_PAGE_SIZE);
  page = pagination.page;
  limit = pagination.limit;
  const skip = (page - 1) * limit;
  const searchWhere = buildSlideWhere(q);
  const filterConditions: Prisma.SlideWhereInput[] = [];

  if (filters.status === "ACTIVE") {
    filterConditions.push({
      placements: {
        some: {
          isActive: true,
        },
      },
    });
  }

  if (filters.status === "INACTIVE") {
    filterConditions.push({
      placements: {
        some: {
          isActive: false,
        },
      },
    });
  }

  if (filters.type) {
    filterConditions.push({
      placements: {
        some: {
          placementKey: filters.type,
        },
      },
    });
  }

  const where =
    filterConditions.length > 0
      ? {
          AND: [searchWhere, ...filterConditions],
        }
      : searchWhere;

  const [data, total] = await Promise.all([
    prisma.slide.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        imageDesktopUrl: true,
        imageMobileUrl: true,
        createdAt: true,
        placements: {
          select: {
            id: true,
            placementKey: true,
            order: true,
            isActive: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    }),
    prisma.slide.count({ where }),
  ]);

  return {
    data: data as unknown as SlideListItem[],
    total,
    page,
    limit,
  };
}

/* ===============================
   ADMIN READ SINGLE SLIDE
================================ */

export async function getAdminSlideById(id: string) {
  return prisma.slide.findUnique({
    where: { id },
    include: {
      placements: true,
    },
  });
}
