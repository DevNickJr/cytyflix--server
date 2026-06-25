import { Repository } from "typeorm";
import { AnalyticsEventRepository } from "../../contracts/analytics-event.interfaces";
import { AnalyticsEvent, EventType } from "../../domain/analytics-event";
import { AnalyticsEventOrmEntity } from "./analytics-event.orm-entity";
import { AnalyticsEventMapper } from "./analytics-event.mapper";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";
import { ReviewOrmEntity } from "@/modules/reviews/infrastructure/persistence/review.orm-entity";

export class AnalyticsEventRepositoryImpl implements AnalyticsEventRepository {
  constructor(
    private readonly ormRepo: Repository<AnalyticsEventOrmEntity>,
    private readonly propertyOrmRepo: Repository<PropertyOrmEntity>,
    private readonly reviewOrmRepo: Repository<ReviewOrmEntity>,
  ) {}

  async create(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    const entity = AnalyticsEventMapper.toPersistence(event);
    const saved = await this.ormRepo.save(entity);
    return AnalyticsEventMapper.toDomain(saved);
  }

  async countByTarget(eventType: EventType, targetId: string, since?: Date): Promise<number> {
    const qb = this.ormRepo
      .createQueryBuilder("event")
      .where("event.eventType = :eventType", { eventType })
      .andWhere("event.targetId = :targetId", { targetId });

    if (since) {
      qb.andWhere("event.createdAt >= :since", { since });
    }

    return qb.getCount();
  }

  async getPropertyViewCounts(propertyIds: string[]): Promise<{ targetId: string; count: number }[]> {
    if (propertyIds.length === 0) return [];

    const results = await this.ormRepo
      .createQueryBuilder("event")
      .select("event.targetId", "targetId")
      .addSelect("COUNT(event.id)", "count")
      .where("event.eventType = :eventType", { eventType: EventType.PROPERTY_VIEW })
      .andWhere("event.targetId IN (:...propertyIds)", { propertyIds })
      .groupBy("event.targetId")
      .getRawMany();

    return results.map((r) => ({
      targetId: r.targetId,
      count: parseInt(r.count),
    }));
  }

  async getPopularProperties(limit: number, since?: Date): Promise<{ targetId: string; count: number }[]> {
    const qb = this.ormRepo
      .createQueryBuilder("event")
      .select("event.targetId", "targetId")
      .addSelect("COUNT(event.id)", "count")
      .where("event.eventType = :eventType", { eventType: EventType.PROPERTY_VIEW });

    if (since) {
      qb.andWhere("event.createdAt >= :since", { since });
    }

    const results = await qb
      .groupBy("event.targetId")
      .orderBy("count", "DESC")
      .limit(limit)
      .getRawMany();

    return results.map((r) => ({
      targetId: r.targetId,
      count: parseInt(r.count),
    }));
  }

  async getAgentProfileViews(agentId: string, since?: Date): Promise<number> {
    return this.countByTarget(EventType.AGENT_PROFILE_VIEW, agentId, since);
  }

  async getAgentPropertyStats(agentId: string): Promise<{
    totalProperties: number;
    averageRating: number;
    totalReviews: number;
  }> {
    const totalProperties = await this.propertyOrmRepo.count({
      where: { ownerId: agentId },
    });

    const result = await this.reviewOrmRepo
      .createQueryBuilder("review")
      .innerJoin("review.property", "property")
      .select("AVG(review.rating)", "average")
      .addSelect("COUNT(review.id)", "count")
      .where("property.ownerId = :agentId", { agentId })
      .getRawOne();

    return {
      totalProperties,
      averageRating: result?.average ? parseFloat(result.average) : 0,
      totalReviews: result?.count ? parseInt(result.count) : 0,
    };
  }
}
