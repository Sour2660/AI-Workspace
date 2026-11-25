import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

/*
  #swagger.tags = ['Authentication']
  #swagger.summary = 'Register User'

  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $name: "Sourabh Basarikatti",
                  $email: "sourabh@gmail.com",
                  $password: "Password@123"
              }
          }
      }
  }

  #swagger.responses[201] = {
      description: "User Registered Successfully"
  }
*/
router.post("/register", authController.register);

/*
  #swagger.tags = ['Authentication']
  #swagger.summary = 'Login User'

  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $email: "sourabh@gmail.com",
                  $password: "Password@123"
              }
          }
      }
  }

  #swagger.responses[200] = {
      description: "Login Successful"
  }
*/
router.post("/login", authController.login);

export default router;