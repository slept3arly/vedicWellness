import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { normalizePagination } from "@/lib/db/pagination";

import type {
  OrderForClient,
  ShippingAddr,
  UserOrderListItem,
} from "@/lib/types/order";

const MAX_ORDER_QUANTITY = 20;
const USER_ORDER_PAGE_SIZE = 20;

/* ========================================================= */
/* SELECT CONFIGS                                             */
/* ========================================================= */

const userOrderListItemSelect = {
  id: true,
  status: true,
  createdAt: true,
  totalAmount: true,
  currency: true,
  items: {
    select: {
      productName: true,
      quantity: true,
    },
    orderBy: { productName: "asc" },
  },
} as const;

const lastPaidOrderSelect = {
  id: true,
  totalAmount: true,
  createdAt: true,
  items: {
    select: {
      productName: true,
    },
    take: 1,
  },
  _count: {
    select: {
      items: true,
    },
  },
} as const;

const rawOrderForUserSelect = {
  id: true,
  status: true,
  totalAmount: true,
  currency: true,
  createdAt: true,
  expiresAt: true,
  paidAt: true,
  paymentId: true,
  shippingName: true,
  shippingPhone: true,
  shippingAddr: true,
  items: {
    select: {
      id: true,
      productName: true,
      productId: true,
      price: true,
      quantity: true,
    },
  },
} as const;

/* ========================================================= */
/* TYPES                                                     */
/* ========================================================= */

export type LastOrder = Prisma.OrderGetPayload<{
  select: typeof lastPaidOrderSelect;
}>;

type RawOrderForUser = Prisma.OrderGetPayload<{
  select: typeof rawOrderForUserSelect;
}>;

type PrismaUserOrderResult = Prisma.OrderGetPayload<{
  select: typeof userOrderListItemSelect;
}>;

/* ========================================================= */
/* USER FUNCTIONS                                             */
/* ========================================================= */

export async function getUserOrders(
  userId: string,
  page = 1,
  limit = USER_ORDER_PAGE_SIZE
): Promise<UserOrderListItem[]> {
  const pagination = normalizePagination(page, limit, USER_ORDER_PAGE_SIZE);
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
    select: userOrderListItemSelect,
  });

  // The Accelerate-extended Prisma client loses the select payload type here;
  // the runtime query still returns exactly the selected fields above.
  return (orders as unknown as PrismaUserOrderResult[]).map((order) => ({
    id: order.id,
    status: order.status.toString(),
    createdAt: order.createdAt,
    totalAmount: order.totalAmount,
    currency: order.currency,
    items: order.items,
  }));
}

export async function createOrderFromCart(
  userId: string,
  addressId: string
) {
  const activeOrders = await prisma.order.count({
    where: {
      userId,
      status: "CREATED",
      expiresAt: { gt: new Date() },
    },
  });

  if (activeOrders >= 3) {
    throw new Error("You already have 3 unpaid orders.");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const item of cart.items) {
    if (!item.product.published) {
      throw new Error(`${item.product.name} is no longer available.`);
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_ORDER_QUANTITY
    ) {
      throw new Error(`Invalid quantity for ${item.product.name}.`);
    }

    if (item.product.stock < item.quantity) {
      throw new Error(`${item.product.name} does not have enough stock.`);
    }
  }

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error("Invalid address");
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        status: "CONFIRMED",
        totalAmount,
        currency: "INR",
        shippingName: address.fullName,
        shippingPhone: address.phone,
        shippingAddr: {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        expiresAt: null,
      },
    });

    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });
  return order;
}

export async function createOrderFromSingleProduct(
  userId: string,
  addressId: string,
  productId: string,
  quantity: number
) {
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_ORDER_QUANTITY
  ) {
    throw new Error("Order quantity must be between 1 and 20.");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.published) {
    throw new Error("Product is no longer available.");
  }

  if (product.stock < quantity) {
    throw new Error("Product does not have enough stock.");
  }

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error("Invalid address");
  }

  const totalAmount = product.price * quantity;

  const order = await prisma.order.create({
    data: {
      userId,
      status: "CONFIRMED",
      totalAmount,
      currency: "INR",
      shippingName: address.fullName,
      shippingPhone: address.phone,
      shippingAddr: {
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      expiresAt: null,
      items: {
        create: [
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity,
          },
        ],
      },
    },
  });
  return order;
}

export async function getOrderNotificationData(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      createdAt: true,
      totalAmount: true,
      currency: true,
      shippingName: true,
      shippingPhone: true,
      shippingAddr: true,
      user: { select: { name: true, email: true } },
      items: {
        select: { productName: true, quantity: true, price: true },
      },
    },
  });
}

export async function getUserOrderCount(userId: string) {
  return prisma.order.count({ where: { userId } });
}

export async function getOrderForUser(
  orderId: string,
  userId: string
): Promise<OrderForClient | null> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: rawOrderForUserSelect,
  });

  if (!order) return null;

  return mapOrderToClient(order as RawOrderForUser);
}

export async function getLastOrder(userId: string) {
  const order = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: lastPaidOrderSelect,
  });

  return order as LastOrder | null;
}

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function mapJsonToShippingAddr(
  value: Prisma.JsonValue | null
): ShippingAddr | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const obj = value as Record<string, unknown>;

  return {
    line1: typeof obj.line1 === "string" ? obj.line1 : undefined,
    line2:
      typeof obj.line2 === "string" || obj.line2 === null
        ? (obj.line2 as string | null)
        : null,
    city: typeof obj.city === "string" ? obj.city : undefined,
    state: typeof obj.state === "string" ? obj.state : undefined,
    postalCode:
      typeof obj.postalCode === "string" ? obj.postalCode : undefined,
    country: typeof obj.country === "string" ? obj.country : undefined,
  };
}

function mapOrderToClient(order: RawOrderForUser): OrderForClient {
  return {
    id: order.id,
    status: order.status.toString(),
    totalAmount: order.totalAmount,
    currency: order.currency,
    createdAt: order.createdAt.toISOString(),
    expiresAt: order.expiresAt ? order.expiresAt.toISOString() : null,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    paymentId: order.paymentId ?? null,
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingAddr: mapJsonToShippingAddr(order.shippingAddr),
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
    })),
  };
}
