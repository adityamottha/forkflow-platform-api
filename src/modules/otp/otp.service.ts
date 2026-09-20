import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { generatePasswordResetToken } from "../../utils/passwordResetToken.js";

import { OTPModel } from "../otp/otp.model.js";
import { OTPPurpose, OTPType } from "../otp/otp.enum.constants.js";
import { authNotification } from "../notification/auth.notification.js";
import { otpRepository } from "./otp.repository.js";
import { ApiError } from "../../utils/apiError.js";
import {
  OTP_LENGTH,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_OTP_ATTEMPTS,
  OTP_BLOCK_DURATION_HOURS,
} from "../otp/otp.enum.constants.js";
import { comparePassword } from "../../utils/password.js";

export class OTPService {
  private generateOTP(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");
  }

  async createRegistrationOTP(userId: string, email: string) {
    const existingOTP = await OTPModel.findOne({
      userId,
      email,
      type: OTPType.EMAIL_VERIFICATION,
      purpose: OTPPurpose.REGISTER,
      verified: false,
    }).sort({ createdAt: -1 });

    // Check resend cooldown
    if (existingOTP) {
      const elapsedSeconds = Math.floor(
        (Date.now() - existingOTP.createdAt.getTime()) / 1000,
      );

      if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
        const remainingSeconds = OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;

        throw new ApiError(
          429,
          `Please wait ${remainingSeconds} seconds before requesting another OTP`,
        );
      }

      // Invalidate previous OTP
      existingOTP.verified = true;

      await existingOTP.save();
    }

    // Generate OTP
    const otp = this.generateOTP();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP expiry
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Create OTP document
    const otpDocument = await OTPModel.create({
      userId,
      email,
      otpHash,
      type: OTPType.EMAIL_VERIFICATION,
      purpose: OTPPurpose.REGISTER,
      expiresAt,
      attempts: 0,
      verified: false,
      lastSentAt: new Date(),
    });

    // Send OTP
    await authNotification.sendRegistrationOTP({
      email,
      otp,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });

    return {
      otpId: otpDocument._id,
      expiresAt,
    };
  }

  // FORGOT PASSWORD OTP -------------------------------
  async createForgotPasswordOTP(userId: string, email: string) {
    const existingOTP = await otpRepository.findLatestOTP(
      userId,
      email,
      OTPType.EMAIL_VERIFICATION,
      OTPPurpose.FORGOT_PASSWORD,
    );

    if (existingOTP) {
      const elapsedSeconds = Math.floor(
        (Date.now() - existingOTP.createdAt.getTime()) / 1000,
      );

      if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
        const remainingSeconds = OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;

        throw new ApiError(
          429,
          `Please wait ${remainingSeconds} seconds before requesting another OTP`,
        );
      }

      // Invalidate previous OTP
      existingOTP.verified = true;
      await existingOTP.save();
    }

    const otp = this.generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const otpDocument = await OTPModel.create({
      userId,
      email,
      otpHash,
      type: OTPType.EMAIL_VERIFICATION,
      purpose: OTPPurpose.FORGOT_PASSWORD,
      expiresAt,
      attempts: 0,
      verified: false,
      lastSentAt: new Date(),
    });

    await authNotification.sendForgotPasswordOTP({
      email,
      otp,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });

    return {
      otpId: otpDocument._id,
      expiresAt,
    };
  }

  // VERIFY FORGOT PASSWORD OTP ---------------------------------------
  async verifyForgotPasswordOTP(userId: string, email: string, otp: string) {
    const otpDocument = await otpRepository.findLatestOTP(
      userId,
      email,
      OTPType.EMAIL_VERIFICATION,
      OTPPurpose.FORGOT_PASSWORD,
    );

    if (!otpDocument) {
      throw new ApiError(
        400,
        "Verification OTP not found. Please request a new OTP",
      );
    }

    if (otpDocument.blockedUntil && otpDocument.blockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (otpDocument.blockedUntil.getTime() - Date.now()) / (1000 * 60),
      );

      throw new ApiError(
        429,
        `Too many attempts. Try again after ${remainingMinutes} minutes`,
      );
    }

    if (otpDocument.expiresAt < new Date()) {
      throw new ApiError(400, "OTP has expired. Please request a new OTP");
    }

    const isValidOTP = await comparePassword(otp, otpDocument.otpHash);

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

    // Mark OTP as verified
    await otpRepository.updateOTP(otpDocument._id.toString(), {
      verified: true,
    });

    // Generate short-lived password reset token
    const resetToken = generatePasswordResetToken(userId);

    return {
      verified: true,
      email,
      resetToken,
      message: "OTP verified successfully",
    };
  }
}

export const otpService = new OTPService();
