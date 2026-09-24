import { z } from "zod";

export const addressSchema = z.object({
  label: z.enum(["HOME", "WORK", "OTHER"]),

  houseNumber: z.string().trim().max(100).optional(),

  buildingName: z.string().trim().max(150).optional(),

  street: z.string().trim().max(200).optional(),

  area: z.string().trim().max(200).optional(),

  city: z.string().trim().min(2, "City is required").max(100),

  state: z.string().trim().min(2, "State is required").max(100),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(100)
    .default("India"),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Invalid pincode"),

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),

  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = addressSchema.partial();

export const addressIdSchema = z.object({
  addressId: z.string().trim().min(1, "Address ID is required"),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
