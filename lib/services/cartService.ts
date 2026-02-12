// lib/services/cartService.ts

import { prisma } from "@/lib/db/prisma";

const MAX_QUANTITY = 20;
const MAX_CART_ITEMS = 15;

export async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return cart;
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  quantity = Math.max(1, Math.min(quantity, MAX_QUANTITY));

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) => item.productId === productId
  );

  if (!existingItem && cart.items.length >= MAX_CART_ITEMS) {
    throw new Error("Cart item limit reached (15 max)");
  }

  if (existingItem) {
    const newQty = Math.min(
      existingItem.quantity + quantity,
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
        quantity,
      },
    });
  }

  return getOrCreateCart(userId);
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number
) {
  quantity = Math.max(1, Math.min(quantity, MAX_QUANTITY));

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getOrCreateCart(userId);
}

export async function removeCartItem(
  userId: string,
  itemId: string
) {
  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getOrCreateCart(userId);
}
