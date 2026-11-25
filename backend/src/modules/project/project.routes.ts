import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import projectController from "./project.controller";

const router = Router();

/*
    #swagger.tags = ['Projects']
*/

/*
    #swagger.summary = 'Create Project'
*/
router.post("/", authenticate, projectController.create);

/*
    #swagger.summary = 'Get Workspace Projects'
*/
router.get(
  "/workspace/:workspaceId",
  authenticate,
  projectController.findAll
);

/*
    #swagger.summary = 'Get Project'
*/
router.get(
  "/:id",
  authenticate,
  projectController.findById
);

/*
    #swagger.summary = 'Update Project'
*/
router.put(
  "/:id",
  authenticate,
  projectController.update
);

/*
    #swagger.summary = 'Archive Project'
*/
router.delete(
  "/:id",
  authenticate,
  projectController.archive
);

export default router;