"use server";

import { revalidateTag } from "next/cache";
import { secureAdminAction } from "@/lib/security/secureAdminAction";
import { OrderStatus } from "@prisma/client"; // ✅ ADD

import {
  updateOrderStatusService,
  cancelOrderService,
} from "@/lib/services/admin/orderService";

import { ORDER_TAG } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/* Update Order Status                                                */
/* ------------------------------------------------------------------ */

export const updateOrderStatus = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "").trim();
    const rawStatus = String(formData.get("status") ?? "").trim(); // renamed

    if (!id || !rawStatus) {
      throw new Error("Invalid input");
    }

    // ✅ ENUM VALIDATION (CRITICAL FIX)
    if (!Object.values(OrderStatus).includes(rawStatus as OrderStatus)) {
      throw new Error("Invalid order status");
    }

    const status = rawStatus as OrderStatus;

    await updateOrderStatusService(id, status, admin.id);

    revalidateTag(ORDER_TAG, "max");
  }
);

/* ------------------------------------------------------------------ */
/* Cancel Order                                                       */
/* ------------------------------------------------------------------ */

export const cancelOrder = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "").trim();

    if (!id) {
      throw new Error("Invalid input");
    }

    await cancelOrderService(id, admin.id);

    revalidateTag(ORDER_TAG, "max");
  }
);