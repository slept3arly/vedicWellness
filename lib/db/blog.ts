import "server-only";
import { prisma } from "@/lib/db/prisma";

/* ------------------------------------------------------------------ */
/* Slugs (Static Params) */
/* ------------------------------------------------------------------ */

export async function getAllPublishedBlogSlugs() {
  return prisma.blog.findMany({
    where: { published: true },
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
  search?: string
) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

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

/* ------------------------------------------------------------------ */
/* Admin Writes */
/* ------------------------------------------------------------------ */

export async function createBlogDB(data: any) {
  return prisma.blog.create({
    data,
    select: { id: true },
  });
}

export async function updateBlogDB(id: string, data: any) {
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
      publishedAt: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Public Reads */
/* ------------------------------------------------------------------ */

export async function getPublicBlogsDB() {
  return prisma.blog.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnailUrl: true,
      author: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
    },
  });
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