import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const AsyncHandler = (
  requestFunction: AsyncRequestHandler,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(requestFunction(req, res, next)).catch((error: unknown) =>
      next(error),
    );
  };
};
