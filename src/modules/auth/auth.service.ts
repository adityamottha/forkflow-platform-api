import { hashPassword, comparePassword } from "../../utils/password.js";

import { authRepository } from "./auth.repository.js";
import { otpRepository } from "../otp/otp.repository.js";
import { otpService } from "../otp/otp.service.js";

import type { RegisterInput } from "./auth.schema.js";
import { ApiError } from "../../utils/apiError.js";

import {
  OTP_BLOCK_DURATION_HOURS,
  MAX_OTP_ATTEMPTS,
} from "../otp/otp.enum.constants.js";

export class AuthService {
  // REGISTER USER SERVICE -----------------------------------------------------
  async register(data: RegisterInput) {
    const { email, password } = data;

    // 1. Check if user already exists
    const existingUser = await authRepository.findByEmail(email);

    // 2. Existing user
    if (existingUser) {
      // User is already verified
      if (existingUser.isEmailVerified) {
        throw new ApiError(409, "An account with this email already exists");
      }

      // User exists but registration was not completed
      // Send another OTP
      await otpService.createRegistrationOTP(
        existingUser._id.toString(),
        existingUser.email,
      );

      return {
        userId: existingUser._id,
        requiresVerification: true,
        otpSent: true,
        message: "Verification OTP sent",
      };
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create new user
    const user = await authRepository.createUser({
      email: email,
      password: hashedPassword,
      isEmailVerified: false,
      role: "CUSTOMER",
    });

    // 5. Create and send registration OTP
    await otpService.createRegistrationOTP(user._id.toString(), user.email);

    // 6. Return safe response
    return {
      userId: user._id,
      requiresVerification: true,
      otpSent: true,
      message: "Registration successful. Verification OTP sent",
    };
  }

  async verifyEmail(email: string, otp: string) {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Find user
    const user = await authRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 2. Check if already verified
    if (user.isEmailVerified) {
      throw new ApiError(400, "Email is already verified");
    }

    // 3. Find latest active OTP
    const otpDocument = await otpRepository.findLatestVerificationOTP(
      user._id.toString(),
      normalizedEmail,
    );

    if (!otpDocument) {
      throw new ApiError(
        400,
        "Verification OTP not found. Please request a new OTP",
      );
    }

    // 4. Check if OTP is blocked
    if (otpDocument.blockedUntil && otpDocument.blockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (otpDocument.blockedUntil.getTime() - Date.now()) / (1000 * 60),
      );

      throw new ApiError(
        429,
        `Too many attempts. Try again after ${remainingMinutes} minutes`,
      );
    }

    // 5. Check OTP expiry
    if (otpDocument.expiresAt < new Date()) {
      throw new ApiError(400, "OTP has expired. Please request a new OTP");
    }

    // 6. Compare OTP
    const isValidOTP = await comparePassword(otp, otpDocument.otpHash);

    // 7. Invalid OTP
    if (!isValidOTP) {
      const attempts = otpDocument.attempts + 1;

      let blockedUntil: Date | null = null;

      if (attempts >= MAX_OTP_ATTEMPTS) {
        blockedUntil = new Date(
          Date.now() + OTP_BLOCK_DURATION_HOURS * 60 * 60 * 1000,
        );
      }

      await otpRepository.updateOTP(otpDocument._id.toString(), {
        attempts,
        blockedUntil,
      });

      if (attempts >= MAX_OTP_ATTEMPTS) {
        throw new ApiError(
          429,
          "Maximum OTP attempts reached. Try again after 1 hour",
        );
      }

      const remainingAttempts = MAX_OTP_ATTEMPTS - attempts;

      throw new ApiError(
        400,
        `Invalid OTP. ${remainingAttempts} attempts remaining`,
      );
    }

    // 8. Mark OTP as verified
    await otpRepository.updateOTP(otpDocument._id.toString(), {
      verified: true,
    });

    // 9. Update AuthUser
    const updatedUser = await authRepository.updateUser(user._id.toString(), {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      accountStatus: "ACTIVE",
    });

    if (!updatedUser) {
      throw new ApiError(500, "Failed to update email verification status");
    }

    // 10. Return result
    return {
      userId: updatedUser._id,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified,
      message: "Email verified successfully",
    };
  }
}

export const authService = new AuthService();
