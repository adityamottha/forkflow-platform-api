import type { Request, Response } from "express";
import { forgotPasswordSchema } from "./auth.schema.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { authService } from "./auth.service.js";
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  resendVerificationOTPSchema,
  verifyForgotPasswordOTPSchema,
  resetPasswordSchema,
  changePasswordSchema,
  temporaryDeleteAccountSchema,
  restoreAccountSchema,
} from "./auth.schema.js";

export class AuthController {
  // REGISTERATION CONTROLLER ----------------------
  async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req.body);

    const result = await authService.register(validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, result, "User registration completed!"));
  }

  // VERIFY EMAIL CONTROLLER ---------------
  async verifyEmail(req: Request, res: Response) {
    const validatedData = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(
      validatedData.email,
      validatedData.otp,
    );
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Email verified successfully"));
  }

  //   RESEND VERIFICATION EMAIL -------------------------
  async resendVerificationOTP(req: Request, res: Response) {
    const validatedData = resendVerificationOTPSchema.parse(req.body);
    const result = await authService.resendVerificationOTP(validatedData.email);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Verification OTP sent successfully"));
  }

  // LOGIN CONTROLLER ========== =============================
  async login(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);

    const result = await authService.login(validatedData);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    return res
      .status(200)
      .cookie("accessToken", result.accessToken, options)
      .cookie("refreshToken", result.refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            userId: result.userId,
            email: result.email,
            role: result.role,
            isEmailVerified: result.isEmailVerified,
            isProfileCompleted: result.isProfileCompleted,
            refreshToken: result.refreshToken,
            accessToken: result.accessToken,
          },
          "Login successful",
        ),
      );
  }

  // REFRESH-ACCESS-TOKEN ------------------------------
  async refreshAccessToken(req: Request, res: Response) {
    // Get refresh token from cookie
    // For mobile apps, you can optionally get it from the body
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    // Call service
    const { accessToken, refreshToken } =
      await authService.refreshAccessToken(incomingRefreshToken);

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    // Set new access and refresh tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access token refreshed successfully",
        ),
      );
  }

  // LOGOUT CONTROLLER ----------------------------------

  async logout(req: Request, res: Response) {
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    await authService.logout(userId);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "Logged out successfully"));
  }

  // FORGOT PASSWORD CONTROLLER ----------------------
  async forgotPassword(req: Request, res: Response) {
    const validatedData = forgotPasswordSchema.parse(req.body);

    const result = await authService.forgotPassword(validatedData.email);

    return res
      .status(200)
      .json(
        new ApiResponse(200, result, "Password reset OTP sent successfully"),
      );
  }

  // VERIFY FORGOT PASSWORD OTP ---------------------------
  async verifyForgotPasswordOTP(req: Request, res: Response) {
    const validatedData = verifyForgotPasswordOTPSchema.parse(req.body);

    const result = await authService.verifyForgotPasswordOTP(
      validatedData.email,
      validatedData.otp,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Forgot password OTP verified successfully",
        ),
      );
  }

  // RESET PASSWORD CONTROLLER ---------------------------
  async resetPassword(req: Request, res: Response) {
    const validatedData = resetPasswordSchema.parse(req.body);

    const result = await authService.resetPassword(
      validatedData.resetToken,
      validatedData.password,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Password reset successfully"));
  }

  // CHANGE PASSWORD CONTROLLER ---------------------------
  async changePassword(req: Request, res: Response) {
    const validatedData = changePasswordSchema.parse(req.body);

    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const result = await authService.changePassword(
      userId,
      validatedData.currentPassword,
      validatedData.newPassword,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Password changed successfully"));
  }

  // TEMPORARY DELETE ACCOUNT CONTROLLER -----------------
  async temporaryDeleteAccount(req: Request, res: Response) {
    const validatedData = temporaryDeleteAccountSchema.parse(req.body);

    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const result = await authService.temporaryDeleteAccount(
      userId,
      validatedData.password,
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(
        new ApiResponse(
          200,
          result,
          "Account temporarily deleted successfully",
        ),
      );
  }

  // RESTORE ACCOUNT CONTROLLER -------------------------
  async restoreAccount(req: Request, res: Response) {
    const validatedData = restoreAccountSchema.parse(req.body);

    const result = await authService.restoreAccount(
      validatedData.email,
      validatedData.password,
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };

    return res
      .status(200)
      .cookie("accessToken", result.accessToken, cookieOptions)
      .cookie("refreshToken", result.refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            userId: result.userId,
            email: result.email,
            isTemporaryDeletedUser: result.isTemporaryDeletedUser,
          },
          "Account restored successfully",
        ),
      );
  }
}

export const authController = new AuthController();
