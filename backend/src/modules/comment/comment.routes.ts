import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import commentController from "./comment.controller";

const router = Router();

/*
    #swagger.tags = ['Comments']
*/

router.post("/", authenticate, commentController.create);

router.get(
  "/task/:taskId",
  authenticate,
  commentController.findAll
);

router.put(
  "/:id",
  authenticate,
  commentController.update
);

router.delete(
  "/:id",
  authenticate,
  commentController.delete
);

export default router;