export const USER_ROLES = [
  "ADMIN",
  "CUSTOMER",
  "DELIVERY_PARTNER",
  "RESTAURANT_OWNER",
  "SUPPORT",
] as const;

export const ACCOUNT_CREATED_BY = ["SELF", "ADMIN"] as const;

export const ACCOUNT_STATUS = [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "BLOCKED",
  "DELETED",
] as const;

export const RESTAURANT_APPROVED_STATUS = [
  "NOT_APPLICABLE",
  "APPROVED",
  "PENDING",
  "REJECTED",
] as const;
