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
