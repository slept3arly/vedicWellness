import "server-only";
import { buildWhere } from "@/lib/db/search";
import { buildCreatedAtRangeFilter } from "@/lib/db/adminFilters";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { OrderStatus, Prisma } from "@prisma/client";
import type { SearchConfig } from "@/lib/db/search";

const orderSearchConfig: SearchConfig = {
  text: ["id", "shippingName", "shippingPhone"],
  enum: [
    {
      path: "status",
      values: Object.values(OrderStatus),
    },
  ],
  relation: ["user.email", "items.some.productName"],
  exact: ["id", "shippingPhone"],
};

export async function getAdminOrders(
  page = 1,
  limit = ADMIN_PAGE_SIZE,
  q = "",
  filters: {
    from?: string;
    to?: string;
    status?: OrderStatus;
  } = {}
) {
  const skip = (page - 1) * limit;
  const searchWhere = buildWhere(q, orderSearchConfig) as Prisma.OrderWhereInput;
  const filterConditions: Prisma.OrderWhereInput[] = [];
  const createdAt = buildCreatedAtRangeFilter(filters);

  if (createdAt) {
    filterConditions.push({ createdAt });
  }

  if (filters.status) {
    filterConditions.push({ status: filters.status });
  }

  const where =
    filterConditions.length > 0
      ? {
          AND: [searchWhere, ...filterConditions],
        }
      : searchWhere;

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
          take: 2,
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
