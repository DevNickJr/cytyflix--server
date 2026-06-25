export enum EventType {
  PROPERTY_VIEW = "property_view",
  AGENT_PROFILE_VIEW = "agent_profile_view",
  PROPERTY_SEARCH = "property_search",
  PROPERTY_SAVE = "property_save",
  INQUIRY_SENT = "inquiry_sent",
  BOOKING_CREATED = "booking_created",
}

export class AnalyticsEvent {
  constructor(
    public readonly id: string,
    public eventType: EventType,
    public targetId: string,
    public userId?: string,
    public metadata?: Record<string, unknown>,
    public createdAt: Date = new Date(),
  ) {}
}
