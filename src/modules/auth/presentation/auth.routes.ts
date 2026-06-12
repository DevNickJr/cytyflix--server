import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "@/shared/middlewares/validate-request";
import { CreateUserSchema, LoginUserSchema } from "../contracts/auth.schemas";

export const authRoutes = (controller: AuthController) => {
  const router = Router();

  router.post("/register", validateRequest([CreateUserSchema]), controller.register);
  router.post("/login", validateRequest([LoginUserSchema]), controller.login);
  router.post("/refresh-token", controller.refreshToken);

  return router;
};
