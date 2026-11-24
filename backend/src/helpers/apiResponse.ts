import { Response } from "express";

export const apiResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};