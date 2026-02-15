import { prisma } from "@/lib/db/prisma";

export async function markOrderPaid(
  orderId: string,
  paymentId: string
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

if (order.status === "PAID") {
  return order; // idempotent
}

if (
  order.status !== "CREATED" &&
  order.status !== "PAYMENT_FAILED"
) {
  throw new Error("Order not payable");
}


  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paymentId,
      paidAt: new Date(),
    },
  });
}
