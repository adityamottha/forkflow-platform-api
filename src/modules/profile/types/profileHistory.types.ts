import type { Types } from "mongoose";

export enum ProfileHistoryField {
  NAME = "NAME",
  AVATAR = "AVATAR",
  PHONE_NUMBER = "PHONE_NUMBER",
}

export interface IProfileHistory {
  userId: Types.ObjectId;

  field: ProfileHistoryField;

  oldValue: string;
  newValue: string;

  changedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}
