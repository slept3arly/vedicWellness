"use server";

import { secureUserAction } from "@/lib/security/secureUserAction";
import { markOrderPaid } from "@/lib/services/paymentService";
import { prisma } from "@/lib/db/prisma";
import { revalidateTag } from "next/cache";

const ORDER_TAG = "orders";

export const mockMarkPaidAction = secureUserAction(
  async (user, orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.id) {
      throw new Error("Invalid order");
    }

    const result = await markOrderPaid(
      orderId,
      "mock_payment_id_123"
    );

    // ✅ REQUIRED
    revalidateTag(ORDER_TAG, "max");

    return result;
  }
);