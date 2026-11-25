import { Response } from "express";

import asyncHandler from "../../helpers/asyncHandler";
import { apiResponse } from "../../helpers/apiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";

import attachmentService from "./attachment.service";

class AttachmentController {
  upload = asyncHandler(async (req: AuthRequest, res: Response) => {
    const file = req.file;
    console.log("file", file);      

    if (!file) {
      throw new Error("File is required");
    }

    const attachment = await attachmentService.upload(
      req.userId!,
      req.body.task,
      file
    );
    console.log("attachment", attachment);

    return apiResponse(
      res,
      201,
      "Attachment uploaded successfully",
      attachment
    );
  });

  findAll = asyncHandler(async (req, res) => {
    const attachments = await attachmentService.findAll(
      req.params.taskId
    );
    console.log("attachments", attachments);

    return apiResponse(
      res,
      200,
      "Attachments fetched successfully",
      attachments
    );
  });

  delete = asyncHandler(async (req, res) => {
    console.log("req.params.id", req.params.id);
    await attachmentService.delete(req.params.id);

    return apiResponse(
      res,
      200,
      "Attachment deleted successfully",
      null
    );
  });
}

export default new AttachmentController();