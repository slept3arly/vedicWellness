import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { CreateAddressInput, UpdateAddressInput } from "@/lib/validators/address";

/**
 * Get all addresses for user
 */
export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Add address
 */
export async function addAddress(userId: string, data: CreateAddressInput) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.address.count({ where: { userId } });

if (count >= 5) {
  throw new Error("Maximum of 5 addresses allowed");
}

const makeDefault = data.isDefault || count === 0;


    if (makeDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return tx.address.create({
      data: {
        ...data,
        isDefault: makeDefault,
        userId,
      },
    });
  });
}

/**
 * Update address
 */
export async function updateAddress(
  userId: string,
  addressId: string,
  data: UpdateAddressInput
) {
  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return tx.address.update({
      where: {
        id: addressId,
        userId, // 🔒 hard scoping
      },
      data,
    });
  });
}

/**
 * Delete address
 */
export async function deleteAddress(userId: string, addressId: string) {
  return prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) return;

    await tx.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default → promote another
    if (address.isDefault) {
      const next = await tx.address.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (next) {
        await tx.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }
  });
}

/**
 * Set default address explicitly
 */
export async function setDefaultAddress(userId: string, addressId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return tx.address.update({
      where: {
        id: addressId,
        userId,
      },
      data: { isDefault: true },
    });
  });
}
