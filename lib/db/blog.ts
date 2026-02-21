import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getAllPublishedBlogSlugs() {
  return prisma.blog.findMany({
    where: { published: true },
    select: { slug: true },
  });
}

/* ✅ Admin reads (paginated with search) */
export async function getAdminBlogs(
  page = 1,
  limit = 25,
  search?: string
) {
  const skip = (page - 1) * limit;

  // Build the filter
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  return prisma.blog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
}

// ... rest of your functions (create, update, delete) stay the same

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
  return prisma.blog.delete({ where: { id } });
}

export async function getBlogById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
    select: { publishedAt: true, slug: true, thumbnailUrl: true, title: true },
  });
}

/* ------------------------------------------------------------------ */
/* Public Reads */
/* ------------------------------------------------------------------ */

export async function getPublicBlogsDB() {
  return prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnailUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getPublicBlogBySlugDB(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, published: true },
  });
}

export async function getPublicBlogMetadataDB(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, published: true },
    select: {
      title: true,
      description: true,
      thumbnailUrl: true,
      createdAt: true,
      updatedAt: true,
      slug: true,
    },
  });
}
