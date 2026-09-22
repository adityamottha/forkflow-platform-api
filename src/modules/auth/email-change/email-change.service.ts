import { ApiError } from "../../../utils/apiError.js";
import { authRepository } from "../auth.repository.js";
import { emailChangeRepository } from "./email-change.repository.js";
import { otpService, OTPService } from "../../otp/otp.service.js";
import { EmailChangeStatus } from "./email-change.constants.js";
import type { RequestEmailChangeInput } from "./email-change.schema.js";
import { OTPType, OTPPurpose } from "../../otp/otp.enum.constants.js";
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
}

export const emailChangeService = new EmailChangeService();
