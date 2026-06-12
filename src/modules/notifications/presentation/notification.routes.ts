import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { AuthGuard } from "@/shared/middlewares/auth.middleware";

export const notificationRoutes = (controller: NotificationController) => {
  const router = Router();

  router.get("/", AuthGuard, controller.getAll);
  router.get("/unread-count", AuthGuard, controller.getUnreadCount);
  router.patch("/read-all", AuthGuard, controller.markAllAsRead);
  router.patch("/:id/read", AuthGuard, controller.markAsRead);

  return router;
};
