import "server-only";
import { prisma } from "@/lib/db/prisma";
import { cache } from "react";

/**
 * Buy-now product
 */
export const getBuyNowProduct = cache(async (productId: string) => {
  return prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      price: true,
      slug: true,
    },
  });
});

/**
 * Cart for checkout
 */
export const getCartForCheckout = cache(async (userId: string) => {
  return prisma.cart.findUnique({
    where: { userId },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          quantity: true,
          productId: true,

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
});

/**
 * Default address
 */
export const getDefaultAddress = cache(async (userId: string) => {
  return prisma.address.findFirst({
    where: {
      userId,
      isDefault: true,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      line1: true,
      line2: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
    },
  });
});