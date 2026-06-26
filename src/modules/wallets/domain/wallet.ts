export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export class Wallet {
  constructor(
    public readonly id: string,
    public userId: string,
    public balance: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}

export class Beneficiary {
  constructor(
    public readonly id: string,
    public userId: string,
    public bankCode: string,
    public bankName: string,
    public accountNumber: string,
    public accountName: string,
    public recipientCode: string,
    public createdAt: Date = new Date(),
  ) {}
}

export class WalletTransaction {
  constructor(
    public readonly id: string,
    public walletId: string,
    public type: TransactionType,
    public amount: number,
    public balanceAfter: number,
    public status: TransactionStatus,
    public reference: string,
    public description: string,
    public metadata: Record<string, any> = {},
    public createdAt: Date = new Date(),
  ) {}
}
