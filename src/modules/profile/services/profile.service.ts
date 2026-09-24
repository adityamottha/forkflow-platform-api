import { ApiError } from "../../../utils/apiError.js";
import { profileRepository } from "../repository/profile.repository.js";
import type { CreateProfileInput } from "../schemas/profile.schema.js";
import { Types } from "mongoose";

export class ProfileService {
  async createProfile(userId: string, data: CreateProfileInput) {
    const existingProfile = await profileRepository.findByUserId(userId);

    if (existingProfile) {
      throw new ApiError(409, "Profile already exists");
    }

    const profile = await profileRepository.createProfile({
      userId: new Types.ObjectId(userId),

      firstName: data.firstName,

      ...(data.lastName !== undefined && {
        lastName: data.lastName,
      }),

      ...(data.phoneNumber !== undefined && {
        phoneNumber: data.phoneNumber,
      }),

      ...(data.countryCode !== undefined && {
        countryCode: data.countryCode,
      }),

      ...(data.dateOfBirth !== undefined && {
        dateOfBirth: new Date(data.dateOfBirth),
      }),

      ...(data.gender !== undefined && {
        gender: data.gender,
      }),

      ...(data.bio !== undefined && {
        bio: data.bio,
      }),

      isProfileCompleted: false,
    });

    return profile;
  }
}

export const profileService = new ProfileService();
