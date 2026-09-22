import { Router } from "express";
import { AsyncHandler } from "../../../utils/ayncHandler.js";
import { verifyJWT } from "../../../middleware/verifyJWT.middleware.js";
import { emailChangeController } from "./email-change.controller.js";

const router: Router = Router();

router.post(
  "/request",
  verifyJWT,
  AsyncHandler(
    emailChangeController.requestEmailChange.bind(emailChangeController),
  ),
);

export default router;
