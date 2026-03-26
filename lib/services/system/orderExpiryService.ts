import { prisma } from "@/lib/db/prisma";
import { revalidateTag } from "next/cache";

const ORDER_TAG = "orders";

export async function expireOldOrders() {
  const now = new Date();

  const result = await prisma.order.updateMany({
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

  // ✅ Only revalidate if something actually changed
  if (result.count > 0) {
    revalidateTag(ORDER_TAG, "max");
  }
}