import { ApiError } from "../../../utils/apiError.js";
import { authRepository } from "../auth.repository.js";
import { emailChangeRepository } from "./email-change.repository.js";
import { otpService, OTPService } from "../../otp/otp.service.js";
import { EmailChangeStatus } from "./email-change.constants.js";
import type { RequestEmailChangeInput } from "./email-change.schema.js";
import {
  OTPType,
  OTPPurpose,
  MAX_OTP_ATTEMPTS,
  OTP_BLOCK_DURATION_HOURS,
} from "../../otp/otp.enum.constants.js";
import { otpRepository } from "../../otp/otp.repository.js";
import { comparePassword } from "../../../utils/password.js";

export class EmailChangeService {
  async requestEmailChange(userId: string, data: RequestEmailChangeInput) {
    const { newEmail } = data;

    // 1. Find authenticated user
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 2. Check account status
    if (user.isDeletedUser) {
      throw new ApiError(403, "Deleted account cannot change email");
    }

    if (user.isTemporaryDeletedUser) {
      throw new ApiError(
        403,
        "Temporarily deleted account cannot change email",
      );
    }

    // 3. Check new email is different
    if (user.email === newEmail) {
      throw new ApiError(
        400,
        "New email must be different from your current email",
      );
    }

    // 4. Check whether new email already exists
    const existingUser = await authRepository.findByEmail(newEmail);

    if (existingUser) {
      throw new ApiError(409, "This email address is already registered");
    }

    // 5. Cancel any existing email-change request
    await emailChangeRepository.cancelActiveRequest(userId);

    // 6. Create new email-change request
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const emailChangeRequest =
      await emailChangeRepository.createEmailChangeRequest({
        userId,
        oldEmail: user.email,
        newEmail,
        expiresAt,
      });

    // 7. Generate/send OTP to current email
    await otpService.createAndSendOTP({
      userId,
      email: user.email,
      purpose: OTPPurpose.CHANGE_EMAIL,
      type: OTPType.EMAIL_VERIFICATION,
    });

    return {
      requestId: emailChangeRequest._id,
      oldEmail: user.email,
      newEmail,
      status: EmailChangeStatus.PENDING_OLD_EMAIL,
      expiresAt,
    };
  }

  // VERIFY OLD EMAIL ------------------
  async verifyOldEmail(userId: string, otp: string) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isDeletedUser) {
      throw new ApiError(403, "Deleted account cannot change email");
    }

    if (user.isTemporaryDeletedUser) {
      throw new ApiError(
        403,
        "Temporarily deleted account cannot change email",
      );
    }

    const emailChangeRequest =
      await emailChangeRepository.findPendingOldEmailRequest(userId);

    if (!emailChangeRequest) {
      throw new ApiError(400, "No active email change request found");
    }

    if (emailChangeRequest.oldEmail !== user.email) {
      throw new ApiError(
        400,
        "Email change request does not match your current email",
      );
    }

    const otpRecord = await otpRepository.findLatestOTP(
      userId,
      emailChangeRequest.oldEmail,
      OTPType.EMAIL_VERIFICATION,
      OTPPurpose.CHANGE_EMAIL,
    );

    if (!otpRecord) {
      throw new ApiError(400, "Verification OTP not found or expired");
    }

    if (otpRecord.blockedUntil && otpRecord.blockedUntil > new Date()) {
      throw new ApiError(
        429,
        "Too many incorrect attempts. Please try again later",
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new ApiError(400, "OTP has expired");
    }

    const isValidOTP = await comparePassword(otp, otpRecord.otpHash);

    if (!isValidOTP) {
      const attempts = otpRecord.attempts + 1;

      if (attempts >= MAX_OTP_ATTEMPTS) {
        await otpRepository.updateOTP(otpRecord._id.toString(), {
          attempts,
          blockedUntil: new Date(
            Date.now() + OTP_BLOCK_DURATION_HOURS * 60 * 60 * 1000,
          ),
        });

        throw new ApiError(
          429,
          "Maximum OTP attempts reached. Please try again later",
        );
      }

      await otpRepository.updateOTP(otpRecord._id.toString(), {
        attempts,
      });

      throw new ApiError(
        400,
        `Invalid OTP. ${MAX_OTP_ATTEMPTS - attempts} attempts remaining`,
      );
    }

    await otpRepository.updateOTP(otpRecord._id.toString(), {
      verified: true,
    });

    const updatedRequest = await emailChangeRepository.markOldEmailVerified(
      emailChangeRequest._id.toString(),
    );

    if (!updatedRequest) {
      throw new ApiError(500, "Failed to update email change request");
    }

    await otpService.createAndSendOTP({
      userId,
      email: emailChangeRequest.newEmail,
      purpose: OTPPurpose.CHANGE_EMAIL,
      type: OTPType.EMAIL_VERIFICATION,
    });

    return {
      requestId: updatedRequest._id,
      oldEmailVerified: true,
      newEmail: emailChangeRequest.newEmail,
      status: EmailChangeStatus.PENDING_NEW_EMAIL,
      expiresAt: updatedRequest.expiresAt,
    };
  }
}

export const emailChangeService = new EmailChangeService();
