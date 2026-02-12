import { z } from "zod";

const MAX_QUANTITY = 20; // keep in sync with service for now

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Invalid product"),
  quantity: z
    .number()
    .int()
    .min(1, "Minimum quantity is 1")
    .max(MAX_QUANTITY, "Quantity exceeds limit"),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1, "Invalid item"),
  quantity: z
    .number()
    .int()
    .min(1, "Minimum quantity is 1")
    .max(MAX_QUANTITY, "Quantity exceeds limit"),
});

export const removeCartItemSchema = z.object({
  itemId: z.string().min(1, "Invalid item"),
});
