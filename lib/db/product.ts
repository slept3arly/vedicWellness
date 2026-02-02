import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function createProductDB(data: any) {
  return prisma.product.create({
    data,
    select: { id: true },
  });
}

export async function updateProductDB(id: string, data: any) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProductDB(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      gallery: true,
    },
  });
}

/* ✅ Admin reads (paginated) */
export async function getAdminProducts(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  return prisma.product.findMany({
    where: q
      ? {
          name: {
            contains: q,
            mode: "insensitive",
          },
        }
      : undefined,

    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
}
