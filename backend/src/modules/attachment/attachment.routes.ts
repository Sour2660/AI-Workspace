import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import upload from "../../middleware/upload.middleware";

import attachmentController from "./attachment.controller";

const router = Router();

/*
    #swagger.tags = ['Attachments']
*/

/*
    #swagger.summary = 'Upload Attachment'
*/
router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  attachmentController.upload
);

/*
    #swagger.summary = 'Get Attachments By Task'
*/
router.get(
  "/task/:taskId",
  authenticate,
  attachmentController.findAll
);

/*
    #swagger.summary = 'Delete Attachment'
*/
router.delete(
  "/:id",
  authenticate,
  attachmentController.delete
);

export default router;