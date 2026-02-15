import { prisma } from "@/lib/db/prisma";

export async function expireOldOrders() {
  const now = new Date();

  await prisma.order.updateMany({
    where: {
      status: "CREATED",
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: "EXPIRED",
    },
  });
}
