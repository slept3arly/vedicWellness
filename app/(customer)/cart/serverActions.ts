"use server";

import { secureUserAction } from "@/lib/security/secureUserAction";
import {
  addToCart,
  updateCartItem,
  removeCartItem,
  getOrCreateCart,
} from "@/lib/services/cartService";

import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "@/lib/validators/cart";

/**
 * Get current user's cart
 */
export const getCartAction = secureUserAction(async (user) => {
  const cart = await getOrCreateCart(user.id);
  return { success: true, data: cart };
});

/**
 * Add product to cart
 */
export const addToCartAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = addToCartSchema.parse(input);
    await addToCart(user.id, parsed.productId, parsed.quantity);
    return { success: true };
  }
);

/**
 * Update item quantity
 */
export const updateCartItemAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = updateCartItemSchema.parse(input);
    await updateCartItem(user.id, parsed.itemId, parsed.quantity);
    return { success: true };
  }
);

/**
 * Remove item
 */
export const removeCartItemAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = removeCartItemSchema.parse(input);
    await removeCartItem(user.id, parsed.itemId);
    return { success: true };
  }
);