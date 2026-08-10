"use server";

import { secureUserAction } from "@/lib/security/secureUserAction";
import { z } from "zod";
import {
  createOrderFromCart,
  createOrderFromSingleProduct,
  getOrderNotificationData,
} from "@/lib/services/public/orderService";
import { sendAdminNotification } from "@/lib/email/transactional/adminNotification";
import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/constants";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";

const createOrderSchema = z.object({
  addressId: z.string().min(1),
  buyNow: z.boolean().optional(),
  productId: z.string().optional(),
  quantity: z.number().int().min(1).max(20).optional(),
});

/**
 * Creates an order-request from the cart or a single product.
 */
export const createOrderAction = secureUserAction(
  async (user, input: unknown) => {
    await rateLimitOrThrow(`order:${user.id}`, limits.order);

    const parsed = createOrderSchema.parse(input);

    let order;

    if (parsed.buyNow) {
      if (!parsed.productId || parsed.quantity === undefined) {
        throw new Error("Invalid buy-now order request");
      }

      order = await createOrderFromSingleProduct(
        user.id,
        parsed.addressId,
        parsed.productId,
        parsed.quantity
      );
    } else {
      order = await createOrderFromCart(
        user.id,
        parsed.addressId
      );
    }

    const notificationOrder = await getOrderNotificationData(order.id);
    if (notificationOrder) {
      try {
        await sendAdminNotification({
          type: "order",
          orderId: notificationOrder.id,
          customerName:
            notificationOrder.user.name ?? notificationOrder.shippingName,
          customerEmail: notificationOrder.user.email,
          customerPhone: notificationOrder.shippingPhone,
          createdAt: notificationOrder.createdAt,
          totalAmount: notificationOrder.totalAmount,
          currency: notificationOrder.currency,
          items: notificationOrder.items,
          shippingAddress:
            notificationOrder.shippingAddr as Record<string, unknown>,
        });
      } catch {
        console.error("[ADMIN_NOTIFICATION_FAILED]", {
          type: "order",
          orderId: notificationOrder.id,
        });
      }
    }

    revalidateTag(CACHE_TAGS.ORDERS, "max");

    return order;
  }
);
