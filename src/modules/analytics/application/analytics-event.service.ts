import { AnalyticsEvent, EventType } from "../domain/analytics-event";
import { AnalyticsEventRepository } from "../contracts/analytics-event.interfaces";

export class AnalyticsEventService {
  constructor(private readonly analyticsRepo: AnalyticsEventRepository) {}

  async trackEvent(
    eventType: EventType,
    targetId: string,
    userId?: string,
    metadata?: Record<string, unknown>,
  ) {
    const event = new AnalyticsEvent(
      crypto.randomUUID(),
      eventType,
      targetId,
      userId,
      metadata,
    );
    return this.analyticsRepo.create(event);
  }

  async getPropertyViews(propertyId: string) {
    const views = await this.analyticsRepo.countByTarget(
      EventType.PROPERTY_VIEW,
      propertyId,
    );
    return { views };
  }

  async getPopularProperties(limit: number, days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.analyticsRepo.getPopularProperties(limit, since);
  }

  async getAgentStats(agentId: string) {
    const [profileViews, propertyStats] = await Promise.all([
      this.analyticsRepo.getAgentProfileViews(agentId),
      this.analyticsRepo.getAgentPropertyStats(agentId),
    ]);

    return {
      profileViews,
      ...propertyStats,
    };
  }
}
