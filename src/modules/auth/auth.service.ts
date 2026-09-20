import crypto from "node:crypto";
import bcrypt from "bcrypt";

import { OTPModel } from "../models/otp.model.js";
import { OTPPurpose, OTPType } from "../models/otp.enum.constants.js";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 30;
const MAX_OTP_ATTEMPTS = 5;

export class OTPService {
  private generateOTP(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");
  }

  async createRegistrationOTP(userId: string, identifier: string) {
    // Check if a recent OTP already exists
    const existingOTP = await OTPModel.findOne({
      userId,
      identifier,
      type: OTPType.EMAIL,
      purpose: OTPPurpose.REGISTRATION,
      verified: false,
    }).sort({ createdAt: -1 });

    // Resend cooldown
    if (existingOTP) {
      const now = Date.now();
      const lastSent = existingOTP.createdAt.getTime();

      const elapsedSeconds = Math.floor((now - lastSent) / 1000);

      if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
        const remainingSeconds = OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;

        throw new Error(
          `Please wait ${remainingSeconds} seconds before requesting another OTP`,
        );
      }

      // Invalidate previous OTP
      existingOTP.verified = true;
      await existingOTP.save();
    }

    // Generate OTP
    const otp = this.generateOTP();

    // Hash OTP before storing
    const otpHash = await bcrypt.hash(otp, 10);

    // Expiry
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Create OTP
    const otpDocument = await OTPModel.create({
      userId,
      identifier,
      otpHash,
      type: OTPType.EMAIL,
      purpose: OTPPurpose.REGISTRATION,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    // TODO:
    // Send OTP through your email service
    //
    // await mailService.sendOTP({
    //   email: identifier,
    //   otp,
    // });

    return {
      otpId: otpDocument._id,
      expiresAt,
    };
  }
}

export const otpService = new OTPService();
