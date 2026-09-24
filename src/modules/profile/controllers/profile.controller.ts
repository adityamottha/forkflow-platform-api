import type { Request, Response } from "express";

import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { createProfileSchema } from "../schemas/profile.schema.js";
import { profileService } from "../services/profile.service.js";

export class ProfileController {
  async createProfile(req: Request, res: Response) {
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const validatedData = createProfileSchema.parse(req.body);

    const result = await profileService.createProfile(userId, validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Profile created successfully"));
  }
}

export const profileController = new ProfileController();
