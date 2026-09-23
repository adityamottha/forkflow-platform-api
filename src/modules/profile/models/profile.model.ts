import { Schema, model } from "mongoose";
import type { IProfile } from "../types/profile.types.js";
import { addressSchema } from "./address.model.js";

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      unique: true,
      index: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: null,
    },

    countryCode: {
      type: String,
      trim: true,
      default: null,
    },

    addresses: {
      type: [addressSchema],
      default: [],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    avatarChangedAt: {
      type: Date,
      default: null,
    },

    nameChangedAt: {
      type: Date,
      default: null,
    },

    phoneNumberChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Profile = model<IProfile>("Profile", profileSchema);
