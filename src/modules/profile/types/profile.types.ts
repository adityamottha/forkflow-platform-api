import type { Types } from "mongoose";

export interface IProfile {
  userId: Types.ObjectId;

  firstName: string;
  lastName?: string;

  avatar?: string;

  phoneNumber?: string;
  countryCode?: string;

  dateOfBirth?: Date;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bio?: string;

  isProfileCompleted: boolean;

  avatarChangedAt: Date | null;
  nameChangedAt: Date | null;
  phoneNumberChangedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
