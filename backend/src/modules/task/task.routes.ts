import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import taskController from "./task.controller";

const router = Router();

/*
    #swagger.tags = ['Tasks']
*/

/*
    #swagger.summary = 'Create Task'
*/
router.post("/", authenticate, taskController.create);

/*
    #swagger.summary = 'Get Project Tasks'
*/
router.get(
  "/project/:projectId",
  authenticate,
  taskController.findAll
);

/*
    #swagger.summary = 'Get Task'
*/
router.get(
  "/:id",
  authenticate,
  taskController.findById
);

/*
    #swagger.summary = 'Update Task'
*/
router.put(
  "/:id",
  authenticate,
  taskController.update
);

/*
    #swagger.summary = 'Update Task Status'
*/
router.patch(
  "/:id/status",
  authenticate,
  taskController.updateStatus
);

/*
    #swagger.summary = 'Delete Task'
*/
router.delete(
  "/:id",
  authenticate,
  taskController.delete
);

export default router;