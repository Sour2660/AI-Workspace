import { Response } from "express";

import asyncHandler from "../../helpers/asyncHandler";
import { apiResponse } from "../../helpers/apiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";

import taskService from "./task.service";
import { console } from "inspector/promises";

class TaskController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.create(req.userId!, req.body);
    console.log("task", task);

    return apiResponse(
      res,
      201,
      "Task created successfully",
      task
    );
  });

  findAll = asyncHandler(async (req, res) => {
    console.log("req.params.projectId", req.params.projectId);
    const tasks = await taskService.findAll(req.params.projectId);

    return apiResponse(
      res,
      200,
      "Tasks fetched successfully",
      tasks
    );
  });

  findById = asyncHandler(async (req, res) => {
    const task = await taskService.findById(req.params.id);
    console.log("task", task);
    return apiResponse(
      res,
      200,
      "Task fetched successfully",
      task
    );
  });

  update = asyncHandler(async (req, res) => {
    const task = await taskService.update(req.params.id, req.body);

    return apiResponse(
      res,
      200,
      "Task updated successfully",
      task
    );
  });

  updateStatus = asyncHandler(async (req, res) => {
    const task = await taskService.updateStatus(
      req.params.id,
      req.body.status
    
    );

    console.log("task", task);
    return apiResponse(
      res,
      200,
      "Task status updated successfully",
      task
    );
  });

  delete = asyncHandler(async (req, res) => {
    await taskService.delete(req.params.id);

    return apiResponse(
      res,
      200,
      "Task deleted successfully",
      null
    );
  });
  
}

export default new TaskController();