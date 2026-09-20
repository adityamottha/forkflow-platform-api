import { z } from "zod";

// REGISTER SCHEMA --------------------------------

export const registerSchema = z
  .object({
    email: z.string().trim().min(1, "Email is required"),

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

// VERIFY USER EMAIL -------------------------------------
export const verifyEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

// RESEND VERIFICATION OTP ---------------------------
export const resendVerificationOTPSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
});

// LOGIN SCHEMA --------------------------------

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email or phone number is required"),

  password: z.string().min(1, "Password is required"),
});

// TYPES --------------------------------

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationOTPInput = z.infer<
  typeof resendVerificationOTPSchema
>;
