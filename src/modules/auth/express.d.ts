import type { IAuthUser } from "../modules/auth/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
      userRole?: string;
    }
  }
}

export {};
