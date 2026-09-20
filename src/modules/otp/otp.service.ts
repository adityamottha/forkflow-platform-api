import crypto from "node:crypto";
import bcrypt from "bcrypt";

import { OTPModel } from "../otp/otp.model.js";
import { OTPPurpose, OTPType } from "../otp/otp.enum.constants.js";

import { ApiError } from "../../utils/apiError.js";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 30;
const MAX_OTP_ATTEMPTS = 5;

export class OTPService {
  private generateOTP(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");
  }

  async createRegistrationOTP(userId: string, identifier: string) {
    const existingOTP = await OTPModel.findOne({
      userId,
      identifier,
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
      identifier,
      otpHash,
      type: OTPType.EMAIL_VERIFICATION,
      purpose: OTPPurpose.REGISTER,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    // Send OTP
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
