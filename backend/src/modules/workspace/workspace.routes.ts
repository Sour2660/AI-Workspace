import { Router } from "express";

import workspaceController from "./workspace.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

/*
    #swagger.tags = ['Workspace']
*/

/*
    #swagger.summary = 'Create Workspace'
*/
router.post("/", authenticate, workspaceController.create);

/*
    #swagger.summary = 'Get My Workspaces'
*/
router.get("/", authenticate, workspaceController.findAll);

/*
    #swagger.summary = 'Get Workspace By Id'
*/
router.get("/:id", authenticate, workspaceController.findById);

/*
    #swagger.summary = 'Update Workspace'
*/
router.put("/:id", authenticate, workspaceController.update);

/*
    #swagger.summary = 'Archive Workspace'
*/
router.delete("/:id", authenticate, workspaceController.archive);

export default router;