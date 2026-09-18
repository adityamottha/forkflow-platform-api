import { Schema, model } from "mongoose";
import type { IAuthUser } from "./auth.types.js";
import {
  USER_ROLES,
  ACCOUNT_CREATED_BY,
  ACCOUNT_STATUS,
  RESTAURANT_APPROVED_STATUS,
} from "./auth.enum.constants.js";

// Schema
const authUserSchema = new Schema<IAuthUser>(
  {
    // ── identity ─────────────────────────────
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    // email
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    emailChangedAt: {
      type: Date,
    },

    // phone
    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumberChangedAt: {
      type: Date,
    },

    //authentication
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLogoutAt: {
      type: Date,
    },
    refreshTokenVersion: {
      type: Number,
      default: 0,
    },

    // authorization
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      index: true,
    },

    // account creation
    accountCreatedBy: {
      type: String,
      enum: ACCOUNT_CREATED_BY,
      default: "SELF",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
    },

    // profile
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    // ── account lifecycle ────────────────────
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUS,
      default: "PENDING",
      index: true,
    },
    suspendedAt: {
      type: Date,
    },
    blockedAt: {
      type: Date,
    },
    blockedReason: {
      type: String,
      trim: true,
    },

    // verification
    isVerifiedUser: {
      type: Boolean,
      default: false,
    },
    userVerifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
    },

    // restaurant approval
    restaurantApprovedStatus: {
      type: String,
      enum: RESTAURANT_APPROVED_STATUS,
      default: "NOT_APPLICABLE",
    },
    restaurantApprovedAt: {
      type: Date,
    },
    restaurantApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
    },
    restaurantRejectionReason: {
      type: String,
      trim: true,
    },

    //permanent delete
    isDeletedUser: {
      type: Boolean,
      default: false,
    },
    userPermanentDeletedAt: {
      type: Date,
    },

    // temporary delete
    isTemporaryDeletedUser: {
      type: Boolean,
      default: false,
    },
    userTemporaryDeletedAt: {
      type: Date,
    },

    //  reports
    whoReportAccounts: [
      {
        type: Schema.Types.ObjectId,
        ref: "AuthUser",
        default: [],
      },
    ],
    countReportAccount: {
      type: Number,
      default: 0,
      min: 0,
    },

    //failed attempts
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastFailedLoginAt: {
      type: Date,
    },
  },

  // time stamps
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes (common query patterns)
authUserSchema.index({ role: 1, accountStatus: 1 });
authUserSchema.index({ isDeletedUser: 1, isTemporaryDeletedUser: 1 });

export const AuthUser = model<IAuthUser>("AuthUser", authUserSchema);
