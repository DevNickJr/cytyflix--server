import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../application/notification.service";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.notificationService.getUserNotifications(req.user!.id, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.notificationService.getUnreadCount(req.user!.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.markAsRead(req.params.id as string, req.user!.id);
      res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.markAllAsRead(req.user!.id);
      res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  };
}
