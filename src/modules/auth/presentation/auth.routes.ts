import { Router } from "express";
import { AuthController } from "./auth.controller";

export const authRoutes = (controller: AuthController) => {
  const router = Router();

  router.post("/register", controller.register);
  router.post("/login", controller.login);

  return router;
};