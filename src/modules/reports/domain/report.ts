export enum ReportReason {
  MISLEADING = "misleading",
  SCAM = "scam",
  INAPPROPRIATE = "inappropriate",
  DUPLICATE = "duplicate",
  OTHER = "other",
}

export enum ReportStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  DISMISSED = "dismissed",
}

export class Report {
  constructor(
    public readonly id: string,
    public userId: string,
    public propertyId: string,
    public reason: ReportReason,
    public description: string,
    public status: ReportStatus = ReportStatus.PENDING,
    public reviewedBy?: string,
    public reviewedAt?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
