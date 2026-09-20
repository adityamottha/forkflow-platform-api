import type { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: Error & {
    statusCode?: number;
  },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("ERROR:-", err);

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
