import type { Types } from "mongoose";
import type { IAddress } from "./address.types.js";

export interface IProfile {
  userId: Types.ObjectId;

  firstName: string;
  lastName?: string;

  avatar?: string;

  phoneNumber?: string;
  countryCode?: string;
  addresses: IAddress[];

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
