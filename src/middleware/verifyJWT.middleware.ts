import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";

import { AuthUser } from "../modules/auth/auth.model.js";
import { AsyncHandler } from "../utils/ayncHandler.js";
import { ApiError } from "../utils/apiError.js";

interface IAccessTokenPayload extends jwt.JwtPayload {
  userId: string;
  role: string;
}

const verifyJWT: RequestHandler = AsyncHandler(async (req, _res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request!");
    }
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    if (!accessTokenKey) {
      throw new ApiError(500, "ACCESS_TOKEN_KEY is not configured");
    }
    const decoded = jwt.verify(token, accessTokenKey) as IAccessTokenPayload;
    const user = await AuthUser.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid access token!");
    }
    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error: unknown) {
    console.error("verifyJWT ERROR:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid or expired access token!");
    }
    throw new ApiError(
      500,
      "Something went wrong while verifying the access token",
    );
  }
});
export { verifyJWT };
