export class ApiError extends Error {
  // define the types
  statusCode: number;
  success: boolean;
  data: null;
  errors: unknown[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: unknown[] = [],
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.data = null;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
