import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getAdminOrders(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { id: { contains: q } },
          { shippingName: { contains: q, mode: "insensitive" as const } },
          { shippingPhone: { contains: q } },
        ],
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        totalAmount: true,
        currency: true,
        createdAt: true,
        userId: true,
        shippingName: true,
        shippingPhone: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}