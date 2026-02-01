import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function createMarqueeDB(data: any) {
  return prisma.marqueeItem.create({
    data,
    select: { id: true },
  });
}

export async function updateMarqueeDB(id: string, data: any) {
  return prisma.marqueeItem.update({
    where: { id },
    data,
  });
}

export async function deleteMarqueeDB(id: string) {
  return prisma.marqueeItem.delete({ where: { id } });
}

export async function getMarqueeById(id: string) {
  return prisma.marqueeItem.findUnique({ where: { id } });
}
