import { Router } from "express";
import { UserController } from "./user.controller";
import { AuthGuard } from "@/shared/middlewares/auth.middleware";

export const userRoutes = (controller: UserController) => {
  const router = Router();

  router.get("/me", AuthGuard, controller.getMe);
  router.put("/me", AuthGuard, controller.updateProfile);
  // router.post("/", controller.create);
  router.get("/:id", controller.get);

  return router;
};
