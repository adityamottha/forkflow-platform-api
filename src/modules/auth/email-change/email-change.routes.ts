import { Router } from "express";
import { AsyncHandler } from "../../../utils/ayncHandler.js";
import { verifyJWT } from "../../../middleware/verifyJWT.middleware.js";
import { emailChangeController } from "./email-change.controller.js";

const router: Router = Router();

// request email change
router.post(
  "/request",
  verifyJWT,
  AsyncHandler(
    emailChangeController.requestEmailChange.bind(emailChangeController),
  ),
);

// verify old email
router.post(
  "/verify-old",
  verifyJWT,
  AsyncHandler(
    emailChangeController.verifyOldEmail.bind(emailChangeController),
  ),
);

export default router;
