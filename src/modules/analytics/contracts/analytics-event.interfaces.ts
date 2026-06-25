import { AnalyticsEvent, EventType } from "../domain/analytics-event";

export interface AnalyticsEventRepository {
  create(event: AnalyticsEvent): Promise<AnalyticsEvent>;
  countByTarget(eventType: EventType, targetId: string, since?: Date): Promise<number>;
  getPropertyViewCounts(propertyIds: string[]): Promise<{ targetId: string; count: number }[]>;
  getPopularProperties(limit: number, since?: Date): Promise<{ targetId: string; count: number }[]>;
  getAgentProfileViews(agentId: string, since?: Date): Promise<number>;
  getAgentPropertyStats(agentId: string): Promise<{
    totalProperties: number;
    averageRating: number;
    totalReviews: number;
  }>;
}
