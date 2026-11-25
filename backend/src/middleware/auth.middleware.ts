import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import AppError from "../errors/AppError";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
    console.log("req.headers.authorization", req.headers.authorization);
    console.log("req.originalUrl", req.originalUrl);
    console.log(req.headers);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Authorization Header:", req.headers.authorization);
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("Token" , token);
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {    
      userId: string;
      
    };

    req.userId = decoded.userId;

    next();
  } catch {
    next(new AppError("Invalid Token", 401));
  }
console.log("====================================");
console.log("URL:", req.originalUrl);
console.log("Authorization:", req.headers.authorization);
};