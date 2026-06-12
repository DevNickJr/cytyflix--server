export enum NotificationType {
  INQUIRY_RECEIVED = "inquiry_received",
  INQUIRY_RESPONDED = "inquiry_responded",
  LISTING_SAVED = "listing_saved",
  SYSTEM = "system",
}

export class Notification {
  constructor(
    public readonly id: string,
    public userId: string,
    public type: NotificationType,
    public title: string,
    public message: string,
    public isRead: boolean = false,
    public metadata: Record<string, any> = {},
    public createdAt: Date = new Date(),
  ) {}
}
