import "server-only";
import { prisma } from "@/lib/db/prisma";

/* ------------------------------------------------------------------ */
/* Write Operations (Admin) */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Admin Reads */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Public Reads */
/* ------------------------------------------------------------------ */

export async function getPublicProductsDB(
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;

  const where = { published: true };

  const [total, products] = await prisma.$transaction([
  prisma.product.count({ where }),
  prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      tag: true,
      price: true,
      imageUrl: true,
      shortDescription: true,
      createdAt: true,
      medicineForm: true,
    },
  }),
]);

  return { total, products };
}

export async function getPublicProductBySlugDB(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
  });
}

export async function getPublicProductMetadataDB(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    select: {
      name: true,
      shortDescription: true,
      imageUrl: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Lightweight Slug Fetch (Sitemap + Static Generation) */
/* ------------------------------------------------------------------ */

export async function getAllPublishedProductSlugs() {
  return prisma.product.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}