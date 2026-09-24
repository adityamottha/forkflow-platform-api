import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/apiError.js";
import { Profile } from "../modules/profile/models/profile.model.js";

export const requireProfileCompleted = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const profile = await Profile.findOne({ userId }).select(
    "isProfileCompleted",
  );

  if (!profile) {
    throw new ApiError(403, "Profile completion is required");
  }

  if (!profile.isProfileCompleted) {
    throw new ApiError(403, "Please complete your profile before continuing");
  }

  next();
};
