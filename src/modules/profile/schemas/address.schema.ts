import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.enum(["HOME", "WORK", "OTHER"]),

  houseNumber: z.string().trim().optional(),
  buildingName: z.string().trim().optional(),
  street: z.string().trim().optional(),
  area: z.string().trim().optional(),

  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  country: z.string().trim().min(2, "Country is required"),

  pincode: z.string().trim().min(4).max(10),

  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateAddressSchema = createAddressSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update address",
  });

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
