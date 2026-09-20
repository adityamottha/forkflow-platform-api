import type { Request, Response } from "express";

import { ApiResponse } from "../../utils/apiResponse.js";
import { authService } from "./auth.service.js";
import { registerSchema } from "./auth.schema.js";

export class AuthController {
  async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req.body);

    const result = await authService.register(validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, result, "User registration completed!"));
  }
}

export const authController = new AuthController();
