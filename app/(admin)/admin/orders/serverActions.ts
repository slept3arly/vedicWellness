"use server";

import { revalidateTag } from "next/cache";
import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  updateOrderStatusService,
  cancelOrderService,
} from "@/lib/services/orderService";

const ORDER_TAG = "orders";

/* ------------------------------------------------------------------ */
/* Update Order Status                                                */
/* ------------------------------------------------------------------ */

export const updateOrderStatus = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");

    if (!id || !status) return;

    await updateOrderStatusService(id, status, admin.id);

    revalidateTag(ORDER_TAG, "default");
  }
);

/* ------------------------------------------------------------------ */
/* Cancel Order                                                       */
/* ------------------------------------------------------------------ */

export const cancelOrder = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    if (!id) return;

    await cancelOrderService(id, admin.id);

    revalidateTag(ORDER_TAG, "default");
  }
);