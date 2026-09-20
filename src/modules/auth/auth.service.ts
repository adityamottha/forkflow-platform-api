import bcrypt from "bcrypt";

import { authRepository } from "./auth.repository.js";
import { otpService } from "../otp/otp.service.js";

import type { RegisterInput } from "./auth.schema.js";
import { ApiError } from "../../utils/apiError.js";

export class AuthService {
  async register(data: RegisterInput) {
    const { identifier, password } = data;

    // 1. Check if user already exists
    const existingUser = await authRepository.findByEmail(identifier);

    // 2. Existing user
    if (existingUser) {
      // User is already verified
      if (existingUser.isEmailVerified) {
        throw new ApiError(409, "An account with this email already exists");
      }

      // User exists but registration was not completed
      // Send another OTP
      await otpService.createRegistrationOTP(
        existingUser._id.toString(),
        existingUser.email,
      );

      return {
        userId: existingUser._id,
        requiresVerification: true,
        otpSent: true,
        message: "Verification OTP sent",
      };
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create new user
    const user = await authRepository.createUser({
      email: identifier,
      password: hashedPassword,
      isEmailVerified: false,
    });

    // 5. Create and send registration OTP
    await otpService.createRegistrationOTP(user._id.toString(), user.email);

    // 6. Return safe response
    return {
      userId: user._id,
      requiresVerification: true,
      otpSent: true,
      message: "Registration successful. Verification OTP sent",
    };
  }
}

export const authService = new AuthService();
