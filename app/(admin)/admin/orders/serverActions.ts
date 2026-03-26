"use server";

import { revalidateTag } from "next/cache";
import { secureAdminAction } from "@/lib/security/secureAdminAction";

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
    const status = String(formData.get("status") ?? "").trim();

    if (!id || !status) {
      throw new Error("Invalid input");
    }

    await updateOrderStatusService(id, status, admin.id);

    revalidateTag(ORDER_TAG,"max");
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

    revalidateTag(ORDER_TAG,"max");
  }
);