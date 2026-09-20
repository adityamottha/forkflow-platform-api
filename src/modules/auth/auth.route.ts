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

export default router;
