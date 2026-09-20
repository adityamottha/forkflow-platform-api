import { AuthUser } from "../modules/auth/auth.model.js";
import { ApiError } from "./apiError.js";

const generateAccessAndRefreshToken = async (
  userId: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    if (!userId) {
      throw new ApiError(400, "UserId is required to generate tokens");
    }

    const authUser = await AuthUser.findById(userId);

    if (!authUser) {
      throw new ApiError(404, "User does not have an account!");
    }

    const accessToken = authUser.generateAccessToken();
    const refreshToken = authUser.generateRefreshToken();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error: unknown) {
    console.error("TOKENS ERROR:", error);

    // Keep existing ApiError status/message
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to generate tokens");
  }
};

export { generateAccessAndRefreshToken };
