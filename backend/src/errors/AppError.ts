import { StatusCodes } from "../constants/httpStatus";

class AppError extends Error {
  statusCode: number;
  success: boolean;

  constructor(message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;