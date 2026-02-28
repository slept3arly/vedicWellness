"use server";

import { secureUserAction } from "@/lib/security/secureUserAction";
import { z } from "zod";
import { createOrderFromCart, createOrderFromSingleProduct } from "@/lib/services/orderService";

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

    if (parsed.buyNow && parsed.productId && parsed.quantity) {
      return await createOrderFromSingleProduct(
        user.id,
        parsed.addressId,
        parsed.productId,
        parsed.quantity,
      );
    }

    return await createOrderFromCart(
      user.id,
      parsed.addressId
    );
  }
);
