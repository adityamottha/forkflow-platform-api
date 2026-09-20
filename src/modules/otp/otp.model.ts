import { Schema, model } from "mongoose";

import { OTPType, OTPPurpose } from "./otp.enum.constants.js";
import type { IOTP } from "./otp.types.js";

const otpSchema = new Schema<IOTP>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      default: null,
      index: true,
    },

    identifier: {
      type: String,
      required: true,
      trim: true,
      index: true,
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

    lastSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically delete expired OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Useful for finding OTPs for a particular verification flow
otpSchema.index({
  userId: 1,
  type: 1,
  purpose: 1,
});

export const OTPModel = model<IOTP>("OTP", otpSchema);
