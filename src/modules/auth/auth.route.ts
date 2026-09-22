import { Router } from "express";

import { authController } from "./auth.controller.js";
import { AsyncHandler } from "../../utils/ayncHandler.js";
import { verifyJWT } from "../../middleware/verifyJWT.middleware.js";
import emailChangeRoutes from "./email-change/email-change.routes.js";

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

// Logout
router.post(
  "/logout",
  verifyJWT,
  AsyncHandler((req, res) => authController.logout(req, res)),
);

// Forgot password
router.post(
  "/forgot-password",
  AsyncHandler((req, res) => authController.forgotPassword(req, res)),
);

// VERIFY FORGOT PASSWORD OTP
router.post(
  "/verify-forgot-password-otp",
  AsyncHandler((req, res) => authController.verifyForgotPasswordOTP(req, res)),
);

// RESET PASSWORD
router.post(
  "/reset-password",
  AsyncHandler((req, res) => authController.resetPassword(req, res)),
);

// CHANGE PASSWORD
router.patch(
  "/change-password",
  verifyJWT,
  AsyncHandler((req, res) => authController.changePassword(req, res)),
);

// TEMPORARY DELETE ACCOUNT
router.delete(
  "/temporary-delete",
  verifyJWT,
  AsyncHandler((req, res) => authController.temporaryDeleteAccount(req, res)),
);

// RESTORE ACCOUNT
router.patch(
  "/restore-account",
  AsyncHandler((req, res) => authController.restoreAccount(req, res)),
);

// PERMANENT DELETE ACCOUNT
router.delete(
  "/permanent-delete",
  verifyJWT,
  AsyncHandler((req, res) => authController.permanentlyDeleteAccount(req, res)),
);

// MOUNT EMAIL ROUTES
// other auth routes...

router.use("/change-email", emailChangeRoutes);

export default router;
