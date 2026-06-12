import { Router } from "express";
import { InquiryController } from "./inquiry.controller";
import { AuthGuard } from "@/shared/middlewares/auth.middleware";

export const inquiryRoutes = (controller: InquiryController) => {
  const router = Router();

  router.post("/", AuthGuard, controller.create);
  router.get("/sent", AuthGuard, controller.getSent);
  router.get("/received", AuthGuard, controller.getReceived);
  router.patch("/:id/status", AuthGuard, controller.updateStatus);

  return router;
};
