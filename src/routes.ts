import { Express } from "express";

import { userRouter } from "@/modules/users/user.module";

export function registerRoutes(app: Express) {
  app.use("/users", userRouter);
}