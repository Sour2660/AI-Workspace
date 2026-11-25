import { Router } from "express";
import userController from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

/*
    #swagger.tags = ['Users']
    #swagger.summary = 'Current Logged In User'
*/
router.get("/me", authenticate, userController.me);

export default router;