import { Profile } from "../models/profile.model.js";
import type { IProfile } from "../types/profile.types.js";

export class ProfileRepository {
  async createProfile(profileData: Partial<IProfile>) {
    return Profile.create(profileData);
  }

  async findByUserId(userId: string) {
    return Profile.findOne({ userId });
  }

  async findById(profileId: string) {
    return Profile.findById(profileId);
  }

  async updateProfile(userId: string, updateData: Partial<IProfile>) {
    return Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteProfile(userId: string) {
    return Profile.findOneAndDelete({ userId });
  }

  async markProfileCompleted(userId: string) {
    return Profile.findOneAndUpdate(
      { userId },
      {
        $set: {
          isProfileCompleted: true,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateName(userId: string, firstName: string, lastName: string | null) {
    return Profile.findOneAndUpdate(
      { userId },
      {
        $set: {
          firstName,
          lastName,
          nameChangedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateAvatar(userId: string, avatar: string) {
    return Profile.findOneAndUpdate(
      { userId },
      {
        $set: {
          avatar,
          avatarChangedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updatePhoneNumber(
    userId: string,
    phoneNumber: string,
    countryCode: string,
  ) {
    return Profile.findOneAndUpdate(
      { userId },
      {
        $set: {
          phoneNumber,
          countryCode,
          phoneNumberChangedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}

export const profileRepository = new ProfileRepository();
