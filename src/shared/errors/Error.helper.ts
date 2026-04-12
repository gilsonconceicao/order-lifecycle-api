export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: Object

  constructor(code: string, message: string, statusCode = 400, details?: Object) {
    super(message)
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}