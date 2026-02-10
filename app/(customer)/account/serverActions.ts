"use server";

import { revalidatePath } from "next/cache";
import { secureUserAction } from "@/lib/security/secureUserAction";
import {
  createAddressSchema,
  updateAddressSchema,
} from "@/lib/validators/address";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/services/addressService";

/**
 * Add address
 */
export const addAddressAction = secureUserAction(
  async (user, input: unknown) => {
    const data = createAddressSchema.parse(input);
    await addAddress(user.id, data);
    revalidatePath("/account");
  }
);

/**
 * Update address
 */
export const updateAddressAction = secureUserAction(
  async (user, addressId: string, input: unknown) => {
    const data = updateAddressSchema.parse(input);
    await updateAddress(user.id, addressId, data);
    revalidatePath("/account");
  }
);

/**
 * Delete address (requires confirmation)
 */
export const deleteAddressAction = secureUserAction(
  async (
    user,
    addressId: string,
    confirmed: boolean = false
  ) => {
    if (!confirmed) {
      throw new Error("Delete action not confirmed");
    }

    await deleteAddress(user.id, addressId);
    revalidatePath("/account");
  }
);

/**
 * Set default address
 */
export const setDefaultAddressAction = secureUserAction(
  async (user, addressId: string) => {
    await setDefaultAddress(user.id, addressId);
    revalidatePath("/account");
  }
);
