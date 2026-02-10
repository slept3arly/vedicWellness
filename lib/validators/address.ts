import { z } from "zod";

/**
 * Base address fields
 * Used by create & update
 */
const addressBase = {
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .max(15, "Invalid phone number"),
  line1: z.string().min(5, "Address line is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
};

/**
 * Create address
 */
export const createAddressSchema = z.object(addressBase);

/**
 * Update address
 * (all fields optional)
 */
export const updateAddressSchema = z.object(
  Object.fromEntries(
    Object.entries(addressBase).map(([k, v]) => [k, v.optional()])
  )
);

/**
 * Types
 */
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
