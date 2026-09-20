export class ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
