import { Request, Response } from "express";

import authService from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

import asyncHandler from "../../helpers/asyncHandler";
import { apiResponse } from "../../helpers/apiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";

                                                   

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await authService.register(body);

    return apiResponse(
      res,
      201,
      "User registered successfully",
      result
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const result = await authService.login(body);

    return apiResponse(
      res,
      200,
      "Login successful",
      result
    );
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.logout(req.userId!);

  return apiResponse(
    res,
    200,
    "Logout successful",
    result
  );
});

}

export default new AuthController();