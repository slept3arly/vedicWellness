"use server";

import { secureUserAction } from "@/lib/security/secureUserAction";
import { markOrderPaid } from "@/lib/services/paymentService";
import { prisma } from "@/lib/db/prisma";

export const mockMarkPaidAction = secureUserAction(
  async (user, orderId: string) => {

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.id) {
      throw new Error("Invalid order");
    }

    return markOrderPaid(orderId, "mock_payment_id_123");
  }
);
