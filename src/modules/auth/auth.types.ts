export interface IAuthUser {
  // identity
  email: string;
  phoneNumber: string;

  // email
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  emailChangedAt?: Date;

  // phone
  isPhoneNumberVerified: boolean;
  phoneNumberChangedAt?: Date;

  // authentication
  password: string;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  lastLogoutAt?: Date;
  refreshTokenVersion: number;

  // authorization
  role:
    "ADMIN" | "CUSTOMER" | "DELIVERY_PARTNER" | "RESTAURANT_OWNER" | "SUPPORT";

  // account creation
  accountCreatedBy: "SELF" | "ADMIN";
  createdBy?: string;

  // profile
  isProfileCompleted: boolean;

  // Account lifecycle
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED" | "BLOCKED" | "DELETED";

  suspendedAt?: Date;
  blockedAt?: Date;
  blockedReason?: string;

  //   verification
  isVerifiedUser: boolean;
  userVerifiedAt?: Date;
  verifiedBy?: string;

  //   restaurant approval
  restaurantApprovedStatus:
    "NOT_APPLICABLE" | "APPROVED" | "PENDING" | "REJECTED";

  restaurantApprovedAt?: Date;
  restaurantApprovedBy?: string;
  restaurantRejectionReason?: string;

  // perm delete account
  isDeletedUser: boolean;
  userPermanentDeletedAt?: Date;

  // temp delete account
  isTemporaryDeletedUser: boolean;
  userTemporaryDeletedAt?: Date;

  // reports will block account if more then 30
  whoReportAccounts: string[];
  countReportAccount: number;

  // failed attemps
  failedLoginAttempts: number;
  lastFailedLoginAt?: Date;

  //   timestamps
  createdAt: Date;
  updatedAt: Date;
}
