import { z } from "zod";

export const createProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .max(50, "Last name cannot exceed 50 characters")
    .optional(),

  phoneNumber: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(15, "Invalid phone number")
    .optional(),

  countryCode: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Invalid country code")
    .optional(),

  dateOfBirth: z
    .string()
    .datetime({ message: "Invalid date of birth" })
    .optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters")
    .optional(),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .max(50, "Last name cannot exceed 50 characters")
    .optional(),

  dateOfBirth: z
    .string()
    .datetime({ message: "Invalid date of birth" })
    .optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters")
    .optional(),
});

export const completeProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lastName: z.string().trim().max(50).optional(),

  phoneNumber: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(15, "Invalid phone number"),

  countryCode: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Invalid country code"),

  dateOfBirth: z
    .string()
    .datetime({ message: "Invalid date of birth" })
    .optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  bio: z.string().trim().max(500).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
