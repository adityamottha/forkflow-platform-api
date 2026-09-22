import { z } from "zod";

export const requestEmailChangeSchema = z.object({
  newEmail: z.string().trim().email("Invalid email address").toLowerCase(),
});

export const verifyOldEmailSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const sendNewEmailOTPSchema = z.object({
  newEmail: z.string().trim().email("Invalid email address").toLowerCase(),
});

export const verifyNewEmailSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type RequestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;

export type VerifyOldEmailInput = z.infer<typeof verifyOldEmailSchema>;

export type SendNewEmailOTPInput = z.infer<typeof sendNewEmailOTPSchema>;

export type VerifyNewEmailInput = z.infer<typeof verifyNewEmailSchema>;
