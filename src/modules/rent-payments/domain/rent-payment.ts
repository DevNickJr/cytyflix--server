export enum RentPaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  MOVE_IN_CONFIRMED = "confirmed",
  RELEASED = "released",
  DISPUTED = "disputed",
  REFUNDED = "refunded",
}

export class RentPayment {
  constructor(
    public readonly id: string,
    public propertyId: string,
    public tenantId: string,
    public ownerId: string,
    public amount: number,
    public paymentReference: string,
    public paymentStatus: string = "pending",
    public status: RentPaymentStatus = RentPaymentStatus.PENDING,
    public moveInDate: Date,
    public tenantConfirmed: boolean = false,
    public confirmedAt?: Date,
    public releasedAt?: Date,
    public expiresAt?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
