import { Schema, model, type Document, type Types } from "mongoose";
import { OTPType, OTPPurpose } from "./otp.enum.constants.js";
import type { IOTP } from "./otp.types.js";

const otpSchema = new Schema<IOTP>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      default: null,
    },

    identifier: {
      type: String,
      required: true,
      trim: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(OTPType),
      required: true,
    },

    purpose: {
      type: String,
      enum: Object.values(OTPPurpose),
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically delete OTP after expiration
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = model<IOTP>("OTP", otpSchema);
