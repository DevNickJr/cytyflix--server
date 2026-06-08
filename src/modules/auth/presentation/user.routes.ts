import { Router } from "express";
import { UserController } from "./user.controller";

export const userRoutes = (controller: UserController) => {
  const router = Router();

  router.post("/", controller.create);
  router.get("/:id", controller.get);
//   router.put("/:id", controller.update);

  return router;
};