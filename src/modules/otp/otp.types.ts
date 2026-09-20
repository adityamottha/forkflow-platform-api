import { Document, Types } from "mongoose";
import { OTPType, OTPPurpose } from "./otp.enum.constants.js";

export interface IOTP extends Document {
  userId?: Types.ObjectId;
  identifier: string;
  otpHash: string;
  type: OTPType;
  purpose: OTPPurpose;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
  lastSentAt: Date;
  updatedAt: Date;
}
