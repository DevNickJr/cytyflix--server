import { Repository } from "typeorm";
import { NotificationRepository } from "@/modules/notifications/contracts/notification.interfaces";
import { Notification } from "@/modules/notifications/domain/notification";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { NotificationOrmEntity } from "./notification.orm-entity";
import { NotificationMapper } from "./notification.mapper";

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    private readonly ormRepo: Repository<NotificationOrmEntity>
  ) {}

  async create(notification: Notification): Promise<Notification> {
    const entity = NotificationMapper.toPersistence(notification);
    const saved = await this.ormRepo.save(entity);
    return NotificationMapper.toDomain(saved);
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<PaginatedResult<Notification>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map(NotificationMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Notification | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;
    return NotificationMapper.toDomain(entity);
  }

  async markAsRead(id: string): Promise<void> {
    await this.ormRepo.update(id, { isRead: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.ormRepo.update({ userId, isRead: false }, { isRead: true });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.ormRepo.count({ where: { userId, isRead: false } });
  }
}
