import { Request, Response } from "express";

import workspaceService from "./workspace.service";
import asyncHandler from "../../helpers/asyncHandler";
import { apiResponse } from "../../helpers/apiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";

class WorkspaceController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspace = await workspaceService.create(
      req.userId!,
      req.body
    );

    return apiResponse(
      res,
      201,
      "Workspace created successfully",
      workspace
    );
  });

  findAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspaces = await workspaceService.findAll(req.userId!);

    return apiResponse(
      res,
      200,
      "Workspaces fetched successfully",
      workspaces
    );
  });

  findById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspace = await workspaceService.findById(
      req.params.id,
      req.userId!
    );

    return apiResponse(
      res,
      200,
      "Workspace fetched successfully",
      workspace
    );
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspace = await workspaceService.update(
      req.params.id,
      req.userId!,
      req.body
    );

    return apiResponse(
      res,
      200,
      "Workspace updated successfully",
      workspace
    );
  });

  archive = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspace = await workspaceService.archive(
      req.params.id,
      req.userId!
    );

    return apiResponse(
      res,
      200,
      "Workspace archived successfully",
      workspace
    );
  });
}

export default new WorkspaceController();