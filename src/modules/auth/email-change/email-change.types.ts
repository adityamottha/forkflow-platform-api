import type { Types } from "mongoose";

import { EmailChangeStatus } from "./email-change.constants.js";

export interface IEmailChangeRequest {
  userId: Types.ObjectId;

  oldEmail: string;
  newEmail: string;

  oldEmailVerified: boolean;
  newEmailVerified: boolean;

  status: EmailChangeStatus;

  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}
