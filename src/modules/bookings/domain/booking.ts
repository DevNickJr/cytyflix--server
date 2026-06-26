export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  DISPUTED = "disputed",
  CANCELLED = "cancelled",
}

export class Booking {
  constructor(
    public readonly id: string,
    public clientId: string,
    public agentId: string,
    public propertyId: string | null,
    public amount: number,
    public paymentReference: string,
    public paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    public bookingStatus: BookingStatus = BookingStatus.PENDING,
    public clientConfirmed: boolean = false,
    public agentConfirmed: boolean = false,
    public scheduledDate: Date,
    public scheduledTime: string = "",
    public notes?: string,
    public expiresAt?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
