import { getUserAddresses } from "@/lib/services/addressService";
import {
  getUserOrders,
  getUserOrderCount,
  getLastOrder,
} from "@/lib/services/public/orderService";
import { expireOldOrders } from "@/lib/services/system/orderExpiryService";
import { getOrCreateCart } from "@/lib/services/cartService";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/db/prisma";

import AccountClient from "./AccountClient";

async function getTotalOrderValue(userId: string): Promise<number> {
  const result = await prisma.order.aggregate({
    where: { userId },
    _sum: {
      totalAmount: true,
    },
  });

  return result._sum.totalAmount ?? 0;
}

export default async function AccountPage() {
  const user = await requireUser();

  // Opportunistically expire old orders before fetching current state
  await expireOldOrders();

  const [
    addresses,
    orders,
    orderCount,
    totalOrderValue,
    lastOrder,
    cart,
  ] = await Promise.all([
    getUserAddresses(user.id),
    getUserOrders(user.id),
    getUserOrderCount(user.id),
    getTotalOrderValue(user.id),
    getLastOrder(user.id),
    getOrCreateCart(user.id),
  ]);

  const cartItemCount = cart.items.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  return (
    <AccountClient
      user={user}
      orderCount={orderCount}
      orders={orders}
      addresses={addresses}
      totalOrderValue={totalOrderValue}
      cartItemCount={cartItemCount}
      lastOrder={
        lastOrder
          ? {
              id: lastOrder.id,
              totalAmount: lastOrder.totalAmount,
              createdAt: lastOrder.createdAt,
              firstProductName:
                lastOrder.items[0]?.productName ?? null,
              itemCount: lastOrder._count.items,
            }
          : null
      }
    />
  );
}
