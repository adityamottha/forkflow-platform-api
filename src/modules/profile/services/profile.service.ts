import { ApiError } from "../../../utils/apiError.js";
import { cloudinaryService } from "../../../services/cloudinary.service.js";
import { profileRepository } from "../repository/profile.repository.js";
import type { CreateProfileInput } from "../schemas/profile.schema.js";
import type { UpdateProfileInput } from "../schemas/profile.schema.js";
import { Types } from "mongoose";
import type { IProfile } from "../types/profile.types.js";

export class ProfileService {
  async createProfile(
    userId: string,
    data: CreateProfileInput,
    avatarFile?: Express.Multer.File,
  ) {
    const existingProfile = await profileRepository.findByUserId(userId);

    if (existingProfile) {
      throw new ApiError(409, "Profile already exists");
    }

    let avatar: string | undefined;

    // Upload avatar to Cloudinary
    if (avatarFile) {
      const uploadedAvatar = await cloudinaryService.uploadOnCloudinary(
        avatarFile.path,
      );

      if (!uploadedAvatar?.secure_url) {
        throw new ApiError(500, "Failed to upload avatar");
      }

      avatar = uploadedAvatar.secure_url;
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

      ...(avatar !== undefined && {
        avatar,
      }),

      ...(data.bio !== undefined && {
        bio: data.bio,
      }),

      isProfileCompleted: false,
    });

    return profile;
  }

  // UPDATE PROFILE -----------------------------------

  async updateProfile(userId: string, data: UpdateProfileInput) {
    if (!userId) {
      throw new ApiError(400, "UserId is required!");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new ApiError(400, "Data is required!");
    }

    // Remove undefined properties
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    ) as Partial<IProfile>;

    const updatedProfile = await profileRepository.updateProfile(
      userId,
      cleanData,
    );

    if (!updatedProfile) {
      throw new ApiError(404, "Profile not found!");
    }

    return updatedProfile;
  }

  // GET PROFILE SERVICE -------------------
  async getProfile(userId: string) {
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      throw new ApiError(404, "Profile not found");
    }

    return profile;
  }
}

export const profileService = new ProfileService();
