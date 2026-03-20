import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getAdminOrders(
  page = 1,
  limit = 20,
  q = ""
) {
  const skip = (page - 1) * limit;
  const query = q.trim();

  const where = query
    ? {
        OR: [
          {
            id: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            user: {
              email: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          },
          {
            shippingName: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            shippingPhone: {
              contains: query,
            },
          },
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
        paidAt: true,

        user: {
          select: {
            email: true,
            name: true,
          },
        },

        shippingName: true,
        shippingPhone: true,

        items: {
          select: {
            productName: true,
            quantity: true,
          },
          take: 2, // preview only
        },

        _count: {
          select: { items: true },
        },
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

export async function getAdminOrderById(id: string) {
  if (!id) {
    throw new Error("Order ID is required");
  }

  return prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      currency: true,
      createdAt: true,
      paidAt: true,
      paymentId: true,

      shippingName: true,
      shippingPhone: true,
      shippingAddr: true,

      user: {
        select: {
          email: true,
          name: true,
        },
      },

      items: {
        select: {
          id: true,
          productName: true,
          price: true,
          quantity: true,
        },
      },
    },
  });
}