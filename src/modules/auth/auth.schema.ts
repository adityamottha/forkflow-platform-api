import { z } from "zod";

// REGISTER SCHEMA --------------------------------

export const registerSchema = z
  .object({
    identifier: z.string().trim().min(1, "Email or phone number is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters"),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// LOGIN SCHEMA --------------------------------

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone number is required"),

  password: z.string().min(1, "Password is required"),
});

// TYPES --------------------------------

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
