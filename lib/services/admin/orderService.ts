import { prisma } from "@/lib/db/prisma";
import { auditWithContext } from "@/lib/observability/auditWithContext";

/* ========================================================= */
/* Update Order Status                                        */
/* ========================================================= */

export async function updateOrderStatusService(
  orderId: string,
  status: string,
  adminId: string
) {
  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new Error("Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as any,
      ...(status === "PAID" ? { paidAt: new Date() } : {}),
    },
    select: {
      id: true,
      status: true,
    },
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "ORDER",
    entityId: orderId,
    metadata: {
      from: existing.status,
      to: updated.status,
    },
  });

  return updated;
}

/* ========================================================= */
/* Cancel Order                                               */
/* ========================================================= */

export async function cancelOrderService(
  orderId: string,
  adminId: string
) {
  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new Error("Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
    },
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "ORDER",
    entityId: orderId,
    metadata: {
      previousStatus: existing.status,
    },
  });

  return updated;
}