import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import asyncHandler from "../../helpers/asyncHandler";
import { apiResponse } from "../../helpers/apiResponse";
import userService from "./user.service";

class UserController {
  me = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await userService.getMe(req.userId!);

    return apiResponse(
      res,
      200,
      "User fetched successfully",
      user
    );
  });
}

export default new UserController();