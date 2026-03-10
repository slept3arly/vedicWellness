// lib/services/cartService.ts

import { prisma } from "@/lib/db/prisma";

const MAX_QUANTITY = 20;
const MAX_CART_ITEMS = 15;

/**
 * Retrieves the user's cart or creates a new one if it doesn't exist.
 */
export async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        select: {
          id: true,
          productId: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              slug: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                slug: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

/**
 * Adds a product to the cart. 
 * If the product exists, it INCREMENTS the quantity.
 */
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  // Clamp quantity within allowed bounds
  const validatedQuantity = Math.max(1, Math.min(quantity, MAX_QUANTITY));

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) => item.productId === productId
  );

  if (!existingItem && cart.items.length >= MAX_CART_ITEMS) {
    throw new Error(`Cart item limit reached (${MAX_CART_ITEMS} max)`);
  }

  if (existingItem) {
    const newQty = Math.min(
      existingItem.quantity + validatedQuantity,
      MAX_QUANTITY
    );

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: validatedQuantity,
      },
    });
  }

  // Return fresh state
  return getOrCreateCart(userId);
}

/**
 * Updates an existing cart item to a SPECIFIC quantity.
 * This replaces the current quantity rather than adding to it.
 */
export async function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number
) {
  // Clamp quantity within allowed bounds
  const validatedQuantity = Math.max(1, Math.min(quantity, MAX_QUANTITY));

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: validatedQuantity },
  });

  return getOrCreateCart(userId);
}

/**
 * Removes an item from the cart.
 */
export async function removeCartItem(
  userId: string,
  itemId: string
) {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getOrCreateCart(userId);
}