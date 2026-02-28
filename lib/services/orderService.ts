// lib/services/orderService.ts

import { prisma } from "@/lib/db/prisma";

export async function createOrderFromCart(
  userId: string,
  addressId: string
) {
  // 🔥 Limit active unpaid orders (hybrid: max 3)
  const activeOrders = await prisma.order.count({
    where: {
      userId,
      status: "CREATED",
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (activeOrders >= 3) {
    throw new Error("You already have 3 unpaid orders.");
  }

  // 1️⃣ Get cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2️⃣ Validate address
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error("Invalid address");
  }

  // 3️⃣ Calculate total
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  // 4️⃣ Expiry 48h
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  // 5️⃣ Transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        status: "CREATED",
        totalAmount,
        currency: "INR",

        shippingName: address.fullName,
        shippingPhone: address.phone,
        shippingAddr: {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },

        expiresAt,
      },
    });

    // Snapshot items
    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        },
      });
    }

    // 🔥 Clear cart immediately
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  return order;
}

export async function createOrderFromSingleProduct(
  userId: string,
  addressId: string,
  productId: string,
  quantity: number
) {
  // 1️⃣ Fetch product
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // 2️⃣ Validate address
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error("Invalid address");
  }

  // 3️⃣ Calculate total
  const totalAmount = product.price * quantity;

  // 4️⃣ Expiry 48h
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  // 5️⃣ Create order (NO cart access)
  const order = await prisma.order.create({
    data: {
      userId,
      status: "CREATED",
      totalAmount,
      currency: "INR",

      shippingName: address.fullName,
      shippingPhone: address.phone,
      shippingAddr: {
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },

      expiresAt,

      items: {
        create: [
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity,
          },
        ],
      },
    },
  });

  return order;
}