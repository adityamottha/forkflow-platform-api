import { Router } from "express";

import { AsyncHandler } from "../../utils/ayncHandler.js";
import { verifyJWT } from "../../middleware/verifyJWT.middleware.js";
import { profileController } from "./controllers/profile.controller.js";

const router: Router = Router();

router.post(
  "/",
  verifyJWT,
  AsyncHandler(profileController.createProfile.bind(profileController)),
);

export default router;
