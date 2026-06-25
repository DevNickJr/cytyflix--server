import { AnalyticsEvent, EventType } from "../../domain/analytics-event";
import { AnalyticsEventOrmEntity } from "./analytics-event.orm-entity";

export class AnalyticsEventMapper {
  static toDomain(entity: AnalyticsEventOrmEntity): AnalyticsEvent {
    return new AnalyticsEvent(
      entity.id,
      entity.eventType as EventType,
      entity.targetId,
      entity.userId,
      entity.metadata,
      entity.createdAt,
    );
  }

  static toPersistence(event: AnalyticsEvent): AnalyticsEventOrmEntity {
    const entity = new AnalyticsEventOrmEntity();
    entity.id = event.id;
    entity.eventType = event.eventType;
    entity.targetId = event.targetId;
    entity.userId = event.userId;
    entity.metadata = event.metadata;
    entity.createdAt = event.createdAt;
    return entity;
  }
}
