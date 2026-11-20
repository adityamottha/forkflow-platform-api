import { Router } from "express";
import { upload } from "../../../middleware/multer.moddleware.js";
import { AsyncHandler } from "../../../utils/ayncHandler.js";
import { verifyJWT } from "../../../middleware/verifyJWT.middleware.js";
import { profileController } from "../controllers/profile.controller.js";

const router: Router = Router();

router.post(
  "/",
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  AsyncHandler(profileController.createProfile.bind(profileController)),
);

// UPDATE -------------
router.patch(
  "/update-profile",
  verifyJWT,
  AsyncHandler(profileController.updateProfile.bind(profileController)),
);

// GET PROFILE ---------------
router.get(
  "/me",
  verifyJWT,
  AsyncHandler(profileController.getProfile.bind(profileController)),
);

export default router;
