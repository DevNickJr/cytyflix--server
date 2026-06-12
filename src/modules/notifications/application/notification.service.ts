import crypto from "crypto";
import { Notification, NotificationType } from "@/modules/notifications/domain/notification";
import { NotificationRepository } from "@/modules/notifications/contracts/notification.interfaces";
import { CreateNotificationDTO } from "@/modules/notifications/contracts/notification.schemas";
import CustomError from "@/shared/utils/custom-error";

export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async createNotification(dto: CreateNotificationDTO) {
    const notification = new Notification(
      crypto.randomUUID(),
      dto.userId,
      dto.type as NotificationType,
      dto.title,
      dto.message,
      false,
      dto.metadata,
    );

    return this.notificationRepo.create(notification);
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    return this.notificationRepo.findByUserId(userId, page, limit);
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) throw new CustomError("Notification not found", 404);
    if (notification.userId !== userId) throw new CustomError("Forbidden", 403);

    await this.notificationRepo.markAsRead(id);
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.markAllAsRead(userId);
    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepo.getUnreadCount(userId);
    return { count };
  }
}
