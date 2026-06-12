import { Notification } from "@/modules/notifications/domain/notification";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByUserId(userId: string, page: number, limit: number): Promise<PaginatedResult<Notification>>;
  findById(id: string): Promise<Notification | null>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}
