import { Response } from "express";

import asyncHandler from "../../helpers/asyncHandler";
import { apiResponse } from "../../helpers/apiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";

import projectService from "./project.service";

class ProjectController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await projectService.create(
      req.userId!,
      req.body
    );

    return apiResponse(
      res,
      201,
      "Project created successfully",
      project
    );
  });

  findAll = asyncHandler(async (req, res) => {
    const projects = await projectService.findAll(
      req.params.workspaceId
    );

    return apiResponse(
      res,
      200,
      "Projects fetched successfully",
      projects
    );
  });

  findById = asyncHandler(async (req, res) => {
    const project = await projectService.findById(
      req.params.id
    );

    return apiResponse(
      res,
      200,
      "Project fetched successfully",
      project
    );
  });

  update = asyncHandler(async (req, res) => {
    const project = await projectService.update(
      req.params.id,
      req.body
    );

    return apiResponse(
      res,
      200,
      "Project updated successfully",
      project
    );
  });

  archive = asyncHandler(async (req, res) => {
    const project = await projectService.archive(
      req.params.id
    );

    return apiResponse(
      res,
      200,
      "Project archived successfully",
      project
    );
  });
}

export default new ProjectController();