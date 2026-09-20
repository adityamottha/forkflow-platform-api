import type { Document, Types } from "mongoose";

import type { OTPPurpose, OTPType } from "./otp.enum.constants.js";

export interface IOTP extends Document {
  userId?: Types.ObjectId | null;

  email: string;

  otpHash: string;

  type: OTPType;

  purpose: OTPPurpose;

  expiresAt: Date;

  attempts: number;

  verified: boolean;

  blockedUntil: Date;
  lastSentAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
