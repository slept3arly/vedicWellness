"use server";

import type { AuthUser } from "@/lib/auth/requireUser";
import { secureUserAction } from "@/lib/security/secureUserAction";
import { revalidateTag } from "next/cache";

const ORDER_TAG = "orders";

/**
 * Cancel order
 */
export const cancelOrderAction = secureUserAction(
  async (user: AuthUser, orderId: string) => {
    const { prisma } = await import("@/lib/db/prisma");

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.id) {
      throw new Error("Order not found");
    }

    if (order.status !== "CREATED") {
      throw new Error("Order cannot be cancelled");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    // ✅ REQUIRED
    revalidateTag(ORDER_TAG, "max");
  }
);