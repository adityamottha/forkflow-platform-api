import { OTPModel } from "./otp.model.js";
import { OTPPurpose, OTPType } from "./otp.enum.constants.js";

export class OTPRepository {
  // Find latest active OTP
  async findLatestVerificationOTP(userId: string, email: string) {
    const otp = await OTPModel.findOne({
      userId,
      email,
      type: OTPType.EMAIL_VERIFICATION,
      purpose: OTPPurpose.REGISTER,
      verified: false,
    }).sort({ createdAt: -1 });

    return otp;
  }

  // Save failed attempt / block OTP
  async updateOTP(
    otpId: string,
    updateData: {
      attempts?: number;
      blockedUntil?: Date | null;
      verified?: boolean;
    },
  ) {
    const otp = await OTPModel.findByIdAndUpdate(otpId, updateData, {
      new: true,
      runValidators: true,
    });

    return otp;
  }

  // FORGOT PASSWORD
  async findLatestOTP(
    userId: string,
    email: string,
    type: OTPType,
    purpose: OTPPurpose,
  ) {
    return OTPModel.findOne({
      userId,
      email,
      type,
      purpose,
      verified: false,
    }).sort({ createdAt: -1 });
  }

  // CREATE AND SEND OTP
  async createOTP(data: {
    userId: string;
    email: string;
    otpHash: string;
    type: OTPType;
    purpose: OTPPurpose;
    expiresAt: Date;
  }) {
    return OTPModel.create(data);
  }
}

export const otpRepository = new OTPRepository();
