import { Router } from "express";

import { authController } from "./auth.controller.js";
import { AsyncHandler } from "../../utils/ayncHandler.js";

const router: Router = Router();

router.post(
  "/register",
  AsyncHandler((req, res) => authController.register(req, res)),
);

export default router;
