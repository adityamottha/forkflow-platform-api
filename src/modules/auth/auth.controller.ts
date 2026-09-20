import type { Request, Response } from "express";

import { ApiResponse } from "../../utils/apiResponse.js";
import { authService } from "./auth.service.js";
import {
  registerSchema,
  verifyEmailSchema,
  resendVerificationOTPSchema,
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
}

export const authController = new AuthController();
