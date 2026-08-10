import "server-only";
import { buildWhere } from "@/lib/db/search";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import type { SearchConfig } from "@/lib/db/search";
import { normalizePagination } from "@/lib/db/pagination";

const blogSearchConfig: SearchConfig = {
  text: ["title", "slug", "author", "category"],
  enum: [],
  relation: [],
  exact: ["slug"],
};

/* ------------------------------------------------------------------ */
/* Slugs (Static Params) */
/* ------------------------------------------------------------------ */

export async function getAllPublishedBlogSlugs() {
  return prisma.blog.findMany({
    where: { published: true },
    take: 500,
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Admin Reads */
/* ------------------------------------------------------------------ */

export async function getAdminBlogs(
  page = 1,
  limit = 25,
  search = "",
  filters: {
    status?: "PUBLISHED" | "UNPUBLISHED" | "";
    category?: string;
    author?: string;
  } = {}
) {
  const pagination = normalizePagination(page, limit, 25);
  page = pagination.page;
  limit = pagination.limit;
  const skip = (page - 1) * limit;
  const searchWhere = buildWhere(search, blogSearchConfig) as Prisma.BlogWhereInput;
  const filterConditions: Prisma.BlogWhereInput[] = [];

  if (filters.status === "PUBLISHED") {
    filterConditions.push({ published: true });
  }

  if (filters.status === "UNPUBLISHED") {
    filterConditions.push({ published: false });
  }

  if (filters.category) {
    filterConditions.push({ category: filters.category });
  }

  if (filters.author) {
    filterConditions.push({ author: filters.author });
  }

  const where =
    filterConditions.length > 0
      ? {
          AND: [searchWhere, ...filterConditions],
        }
      : searchWhere;

  const [data, total] = await prisma.$transaction([
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        author: true,
        category: true,
        thumbnailUrl: true,
        published: true,
        createdAt: true,
        publishedAt: true,
      },
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function getAdminBlogFilterOptions() {
  const authors = await prisma.blog.findMany({
    where: {
      author: {
        not: null,
      },
    },
    distinct: ["author"],
    orderBy: {
      author: "asc",
    },
    select: {
      author: true,
    },
  });

  return {
    authors: authors
      .map((entry) => entry.author)
      .filter((value): value is string => Boolean(value)),
  };
}

/* ------------------------------------------------------------------ */
/* Admin Writes */
/* ------------------------------------------------------------------ */

export async function createBlogDB(data: Prisma.BlogCreateInput) {
  return prisma.blog.create({
    data,
    select: { id: true },
  });
}

export async function updateBlogDB(id: string, data: Prisma.BlogUpdateInput) {
  return prisma.blog.update({
    where: { id },
    data,
  });
}

export async function deleteBlogDB(id: string) {
  return prisma.blog.delete({
    where: { id },
  });
}

export async function getBlogById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnailUrl: true,
      published: true,
      publishedAt: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Public Reads */
/* ------------------------------------------------------------------ */

export async function getPublicBlogsDB(page = 1, limit = 15) {
  const pagination = normalizePagination(page, limit, 15);
  const where = { published: true };
  const select = {
    id: true,
    title: true,
    slug: true,
    description: true,
    thumbnailUrl: true,
    author: true,
    createdAt: true,
    updatedAt: true,
    publishedAt: true,
  } as const;
  const offset = 3 + (pagination.page - 1) * pagination.limit;

  const [featuredBlogs, data, total] = await prisma.$transaction([
    prisma.blog.findMany({ where, orderBy: { publishedAt: "desc" }, take: 3, select }),
    prisma.blog.findMany({ where, orderBy: { publishedAt: "desc" }, skip: offset, take: pagination.limit, select }),
    prisma.blog.count({ where }),
  ]);

  return {
    featuredBlogs,
    data,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(Math.max(0, total - 3) / pagination.limit),
  };
}

export async function getPublicBlogBySlugDB(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      thumbnailUrl: true,
      author: true,
      category: true,
      tags: true,

      /* SEO */
      metaTitle: true,
      metaDescription: true,
      canonicalUrl: true,

      /* Dates */
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
    },
  });
}

export async function getRelatedBlogsDB(
  slug: string,
  tags: string[],
  limit = 4
) {
  if (!tags.length) return [];

  return prisma.blog.findMany({
    where: {
      published: true,
      slug: { not: slug },
      tags: {
        hasSome: tags,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnailUrl: true,
      author: true,
      createdAt: true,
      publishedAt: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* ADMIN READ SINGLE BLOG                                             */
/* ------------------------------------------------------------------ */

export async function getAdminBlogById(id: string) {
  return prisma.blog.findFirst({
    where: { id },
  });
}
