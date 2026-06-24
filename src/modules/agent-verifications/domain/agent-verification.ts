export enum VerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export class AgentVerification {
  constructor(
    public readonly id: string,
    public userId: string,
    public idDocumentUrl: string,
    public selfieUrl: string,
    public status: VerificationStatus = VerificationStatus.PENDING,
    public rejectionReason?: string,
    public reviewedBy?: string,
    public reviewedAt?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
