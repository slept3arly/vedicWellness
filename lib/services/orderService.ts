// lib/services/orderService.ts

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

import type {
  OrderForClient,
  ShippingAddr,
  UserOrderListItem,
} from "@/lib/types/order";

import { getAdminOrders } from "@/lib/db/order"; // ✅ NEW IMPORT

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

export type LastPaidOrder = Prisma.OrderGetPayload<{
  select: typeof lastPaidOrderSelect;
}>;

type RawOrderForUser = Prisma.OrderGetPayload<{
  select: typeof rawOrderForUserSelect;
}>;

type PrismaUserOrderResult = Prisma.OrderGetPayload<{
  select: typeof userOrderListItemSelect;
}>;

/* ========================================================= */
/* USER-FACING FUNCTIONS                                     */
/* ========================================================= */

export async function getUserOrders(userId: string): Promise<UserOrderListItem[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: userOrderListItemSelect,
  });

  return (orders as any[]).map((order: PrismaUserOrderResult) => ({
    id: order.id,
    status: order.status.toString(),
    createdAt: order.createdAt,
    totalAmount: order.totalAmount,
    currency: order.currency,
    items: order.items,
  }));
}

export async function createOrderFromCart(userId: string, addressId: string) {
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

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) throw new Error("Invalid address");

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  return await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        status: "CREATED",
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
        expiresAt,
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

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });
}

export async function createOrderFromSingleProduct(
  userId: string,
  addressId: string,
  productId: string,
  quantity: number
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) throw new Error("Invalid address");

  const totalAmount = product.price * quantity;

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  return prisma.order.create({
    data: {
      userId,
      status: "CREATED",
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
      expiresAt,
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

  return mapOrderToClient(order as unknown as RawOrderForUser);
}

export async function getLastPaidOrder(userId: string) {
  const order = await prisma.order.findFirst({
    where: { userId, status: "PAID" },
    orderBy: { createdAt: "desc" },
    select: lastPaidOrderSelect,
  });

  return order as LastPaidOrder | null;
}

/* ========================================================= */
/* ADMIN FUNCTIONS (NEW)                                      */
/* ========================================================= */

export async function getAdminOrdersService(
  page = 1,
  limit = 20,
  q = ""
) {
  const result = await getAdminOrders(page, limit, q);

  return {
    orders: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
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