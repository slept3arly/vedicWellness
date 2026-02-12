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
  return getOrCreateCart(user.id);
});

/**
 * Add product to cart
 */
export const addToCartAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = addToCartSchema.parse(input);
    return addToCart(user.id, parsed.productId, parsed.quantity);
  }
);

/**
 * Update item quantity
 */
export const updateCartItemAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = updateCartItemSchema.parse(input);
    return updateCartItem(user.id, parsed.itemId, parsed.quantity);
  }
);

/**
 * Remove item
 */
export const removeCartItemAction = secureUserAction(
  async (user, input: unknown) => {
    const parsed = removeCartItemSchema.parse(input);
    return removeCartItem(user.id, parsed.itemId);
  }
);
