import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";
import type { IPasswordResetTokenPayload } from "../modules/auth/auth.types.js";

export const generatePasswordResetToken = (userId: string): string => {
  const secret = process.env.PASSWORD_RESET_TOKEN_KEY;

  if (!secret) {
    throw new ApiError(500, "PASSWORD_RESET_TOKEN_KEY is not configured");
  }

  return jwt.sign(
    {
      userId,
      purpose: "PASSWORD_RESET",
    },
    secret,
    {
      expiresIn: "10m",
    },
  );
};

export const verifyPasswordResetToken = (
  token: string,
): IPasswordResetTokenPayload => {
  const secret = process.env.PASSWORD_RESET_TOKEN_KEY;

  if (!secret) {
    throw new ApiError(500, "PASSWORD_RESET_TOKEN_KEY is not configured");
  }

  try {
    const decoded = jwt.verify(token, secret) as IPasswordResetTokenPayload;

    if (!decoded.userId || decoded.purpose !== "PASSWORD_RESET") {
      throw new ApiError(401, "Invalid password reset token");
    }

    return decoded;
  } catch {
    throw new ApiError(401, "Invalid or expired password reset token");
  }
};
