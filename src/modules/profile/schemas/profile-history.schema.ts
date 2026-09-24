import { z } from "zod";

export const profileHistoryFieldSchema = z.enum([
  "NAME",
  "AVATAR",
  "PHONE_NUMBER",
]);

export const getProfileHistoryByFieldSchema = z.object({
  field: profileHistoryFieldSchema,
});

export type ProfileHistoryFieldInput = z.infer<
  typeof profileHistoryFieldSchema
>;
