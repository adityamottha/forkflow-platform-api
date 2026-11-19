import type { Request, Response } from "express";

import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import {
  createProfileSchema,
  updateProfileSchema,
} from "../schemas/profile.schema.js";
import { profileService } from "../services/profile.service.js";

export class ProfileController {
  async createProfile(req: Request, res: Response) {
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const validatedData = createProfileSchema.parse(req.body);

    const result = await profileService.createProfile(
      userId,
      validatedData,
      req.file,
    );

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Profile created successfully"));
  }

  // UPDATE PROFILE CONTRLLER -------------------------
  async updateProfile(req: Request, res: Response) {
    const userId = req.user?._id?.toString();

    const validatedData = updateProfileSchema.parse(req.body);

    const result = await profileService.updateProfile(userId, validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Profile Updated!"));
  }

  // GET PROFILE CONTROLLER --------------
  async getProfile(req: Request, res: Response) {
    const userId = req.user?._id;
    console.log(userId);

    const profile = await profileService.getProfile(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, profile, "Profile fetched successfully"));
  }
}

export const profileController = new ProfileController();
