import { Schema, model } from "mongoose";

import { EmailChangeStatus } from "./email-change.constants.js";
import type { IEmailChangeRequest } from "./email-change.types.js";

const emailChangeRequestSchema = new Schema<IEmailChangeRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      index: true,
    },

    oldEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    newEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    oldEmailVerified: {
      type: Boolean,
      default: false,
    },

    newEmailVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(EmailChangeStatus),
      default: EmailChangeStatus.PENDING_OLD_EMAIL,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically remove expired email-change requests.

emailChangeRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

//Find active email-change request for a user.

emailChangeRequestSchema.index({
  userId: 1,
  status: 1,
});

export const EmailChangeRequest = model<IEmailChangeRequest>(
  "EmailChangeRequest",
  emailChangeRequestSchema,
);
