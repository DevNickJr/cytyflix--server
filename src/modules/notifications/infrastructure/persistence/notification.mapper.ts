import { Notification, NotificationType } from "../../domain/notification";
import { NotificationOrmEntity } from "./notification.orm-entity";

export class NotificationMapper {
  static toDomain(entity: NotificationOrmEntity): Notification {
    return new Notification(
      entity.id,
      entity.userId,
      entity.type as NotificationType,
      entity.title,
      entity.message,
      entity.isRead,
      entity.metadata || {},
      entity.createdAt,
    );
  }

  static toPersistence(notification: Notification): NotificationOrmEntity {
    const entity = new NotificationOrmEntity();
    entity.id = notification.id;
    entity.userId = notification.userId;
    entity.type = notification.type;
    entity.title = notification.title;
    entity.message = notification.message;
    entity.isRead = notification.isRead;
    entity.metadata = notification.metadata;
    entity.createdAt = notification.createdAt;
    return entity;
  }
}
