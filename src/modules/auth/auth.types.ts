import { Document, Types } from "mongoose";
import {
  USER_ROLES,
  ACCOUNT_CREATED_BY,
  ACCOUNT_STATUS,
  RESTAURANT_APPROVED_STATUS,
} from "./auth.enum.constants.js";
import type { JwtPayload } from "jsonwebtoken";
// INTERFACE ---------------------------------------------------------
export interface IAuthUser extends Document {
  // identity
  email: string;

  // email
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  emailChangedAt?: Date;
  emailHistory: string[];

  // authentication
  password: string;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  lastLogoutAt?: Date;
  refreshTokenVersion: number;

  // authorization
  role: (typeof USER_ROLES)[number];

  // account creation
  accountCreatedBy: (typeof ACCOUNT_CREATED_BY)[number];
  createdBy?: Types.ObjectId;

  // profile
  isProfileCompleted: boolean;

  // account lifecycle
  accountStatus: (typeof ACCOUNT_STATUS)[number];
  suspendedAt?: Date;
  blockedAt?: Date;
  blockedReason?: string;

  // verification
  isVerifiedUser: boolean;
  userVerifiedAt?: Date;
  verifiedBy?: Types.ObjectId;

  // restaurant approval
  restaurantApprovedStatus: (typeof RESTAURANT_APPROVED_STATUS)[number];
  restaurantApprovedAt?: Date;
  restaurantApprovedBy?: Types.ObjectId;
  restaurantRejectionReason?: string;

  // permanent delete
  isDeletedUser: boolean;
  userPermanentDeletedAt?: Date;

  // temporary delete
  isTemporaryDeletedUser: boolean;
  userTemporaryDeletedAt?: Date;

  // reports
  whoReportAccounts: Types.ObjectId[];
  countReportAccount: number;

  // failed attempts
  failedLoginAttempts: number;
  lastFailedLoginAt?: Date;

  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthUserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IRefreshTokenPayload extends JwtPayload {
  userId: string;
  tokenVersion: number;
}

export interface IPasswordResetTokenPayload extends JwtPayload {
  userId: string;
  purpose: "PASSWORD_RESET";
}
