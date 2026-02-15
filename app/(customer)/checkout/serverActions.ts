"use server";

import { secureUserAction } from "@/lib/security/secureUserAction";
import { z } from "zod";
import { createOrderFromCart } from "@/lib/services/orderService";

const createOrderSchema = z.object({
  addressId: z.string().min(1, "Address is required"),
});

/**
 * Creates a PENDING order from cart
 * Does NOT clear cart
 * Does NOT handle payment yet
 */
export const createOrderAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = createOrderSchema.parse(input);

    const order = await createOrderFromCart(
      user.id,
      parsed.addressId
    );

    return order;
  }
);
