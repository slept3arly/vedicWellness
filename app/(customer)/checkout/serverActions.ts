"use server";

import { secureUserAction } from "@/lib/security/secureUserAction";
import { z } from "zod";
import { createOrderFromCart, createOrderFromSingleProduct } from "@/lib/services/public/orderService";
import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/constants";

const createOrderSchema = z.object({
  addressId: z.string().min(1),
  buyNow: z.boolean().optional(),
  productId: z.string().optional(),
  quantity: z.number().optional(),
});

/**
 * Creates a PENDING order from cart
 * Does NOT clear cart
 * Does NOT handle payment yet
 */
export const createOrderAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = createOrderSchema.parse(input);

    let order;

    if (parsed.buyNow && parsed.productId && parsed.quantity) {
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

    // ✅ REQUIRED
    revalidateTag(CACHE_TAGS.ORDERS, "max");

    return order;
  }
);
