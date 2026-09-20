import { Router } from "express";

import { authController } from "./auth.controller.js";
import { AsyncHandler } from "../../utils/ayncHandler.js";

const router: Router = Router();

router.post(
  "/register",
  AsyncHandler((req, res) => authController.register(req, res)),
);
// Verify Email
router.post(
  "/verify-email",
  AsyncHandler((req, res) => authController.verifyEmail(req, res)),
);
// Resend Verification OTP
router.post(
  "/resend-verification-otp",
  AsyncHandler((req, res) => authController.resendVerificationOTP(req, res)),
);

// Login
router.post(
  "/login",
  AsyncHandler((req, res) => authController.login(req, res)),
);

// Refresh-access-token
router.post(
  "/refresh-token",
  AsyncHandler((req, res) => authController.refreshAccessToken(req, res)),
);

export default router;
