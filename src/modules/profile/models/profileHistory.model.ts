import { Schema, model } from "mongoose";
import {
  ProfileHistoryField,
  type IProfileHistory,
} from "../types/profileHistory.types.js";

const profileHistorySchema = new Schema<IProfileHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      index: true,
    },

    field: {
      type: String,
      enum: Object.values(ProfileHistoryField),
      required: true,
    },

    oldValue: {
      type: String,
      required: true,
    },

    newValue: {
      type: String,
      required: true,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

profileHistorySchema.index({
  userId: 1,
  field: 1,
  changedAt: -1,
});

export const ProfileHistory = model<IProfileHistory>(
  "ProfileHistory",
  profileHistorySchema,
);
