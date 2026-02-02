import "server-only";
import { prisma } from "@/lib/db/prisma";

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
