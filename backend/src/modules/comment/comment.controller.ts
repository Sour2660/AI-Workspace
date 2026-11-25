import { Response } from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { apiResponse } from "../../helpers/apiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";
import commentService from "./comment.service";

class CommentController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const comment = await commentService.create(req.userId!, req.body);

    return apiResponse(res, 201, "Comment added successfully", comment);
  });

  findAll = asyncHandler(async (req, res) => {
    const comments = await commentService.findAll(req.params.taskId);

    return apiResponse(res, 200, "Comments fetched successfully", comments);
  });

  update = asyncHandler(async (req, res) => {
    const comment = await commentService.update(req.params.id, req.body);

    return apiResponse(res, 200, "Comment updated successfully", comment);
  });

  delete = asyncHandler(async (req, res) => {
    await commentService.delete(req.params.id);

    return apiResponse(res, 200, "Comment deleted successfully", null);
  });
}

export default new CommentController();