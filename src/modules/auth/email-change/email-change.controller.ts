import type { Request, Response } from "express";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { emailChangeService } from "./email-change.service.js";
import { requestEmailChangeSchema } from "./email-change.schema.js";
import { verifyOldEmailSchema } from "./email-change.schema.js";

export class EmailChangeController {
  // request email change
  async requestEmailChange(req: Request, res: Response) {
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const validatedData = requestEmailChangeSchema.parse(req.body);

    const result = await emailChangeService.requestEmailChange(
      userId,
      validatedData,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Email change verification started successfully",
        ),
      );
  }

  // VERIFY OLD EMAIL CONTROLLER -----------------
  async verifyOldEmail(req: Request, res: Response) {
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const validatedData = verifyOldEmailSchema.parse(req.body);

    const result = await emailChangeService.verifyOldEmail(
      userId,
      validatedData.otp,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Old email verified successfully. OTP sent to your new email",
        ),
      );
  }
}

export const emailChangeController = new EmailChangeController();
