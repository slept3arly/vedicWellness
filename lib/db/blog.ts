import "server-only";
import { prisma } from "@/lib/db/prisma";

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

/* ✅ Admin reads */

export async function getAdminBlogs() {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
}
