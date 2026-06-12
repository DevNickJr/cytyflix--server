export enum InquiryStatus {
  PENDING = "pending",
  RESPONDED = "responded",
  CLOSED = "closed",
}

export class Inquiry {
  constructor(
    public readonly id: string,
    public senderId: string,
    public propertyId: string,
    public recipientId: string,
    public message: string,
    public status: InquiryStatus = InquiryStatus.PENDING,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
