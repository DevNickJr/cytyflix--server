import crypto from "crypto";
import { Wallet, WalletTransaction, Beneficiary, TransactionType, TransactionStatus } from "../domain/wallet";
import { WalletRepository } from "../contracts/wallet.interfaces";
import { createTransferRecipient, initiateTransfer, listBanks, resolveAccountNumber, PaystackBank } from "@/infrastructure/payments/paystack";
import CustomError from "@/shared/utils/custom-error";

export class WalletService {
  constructor(
    private readonly walletRepo: WalletRepository,
  ) {}

  async getOrCreateWallet(userId: string): Promise<Wallet> {
    const existing = await this.walletRepo.findByUserId(userId);
    if (existing) return existing;

    const wallet = new Wallet(
      crypto.randomUUID(),
      userId,
      0,
    );
    return this.walletRepo.create(wallet);
  }

  async getBalance(userId: string): Promise<Wallet> {
    return this.getOrCreateWallet(userId);
  }

  async creditWallet(
    userId: string,
    amount: number,
    reference: string,
    description: string,
    metadata: Record<string, any> = {},
  ): Promise<WalletTransaction> {
    const wallet = await this.getOrCreateWallet(userId);

    // Idempotency: check for duplicate reference
    const existing = await this.walletRepo.findTransactionByReference(reference);
    if (existing) return existing;

    const balanceAfter = wallet.balance + amount;

    const transaction = new WalletTransaction(
      crypto.randomUUID(),
      wallet.id,
      TransactionType.CREDIT,
      amount,
      balanceAfter,
      TransactionStatus.COMPLETED,
      reference,
      description,
      metadata,
    );

    // TODO: i need to wrap the following two operations in a transaction to ensure atomicity
    await this.walletRepo.createTransaction(transaction);
    await this.walletRepo.updateBalance(wallet.id, balanceAfter);

    return transaction;
  }

  async requestWithdrawal(
    userId: string,
    amount: number,
    beneficiaryId?: string,
    bankCode?: string,
    accountNumber?: string,
    accountName?: string,
  ): Promise<WalletTransaction> {
    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      throw new CustomError("Insufficient wallet balance", 400);
    }

    if (wallet.balance < 1000 * 100) { // Assuming the balance is in kobo (or cents), so 1000 Naira = 100000 kobo
      throw new CustomError("Minimum withdrawal amount is 1000", 400);
    }

    let recipientCode: string;
    let resolvedBankCode: string;
    let resolvedAccountNumber: string;
    let resolvedAccountName: string;

    if (beneficiaryId) {
      const beneficiary = await this.walletRepo.findBeneficiaryById(beneficiaryId);
      if (!beneficiary || beneficiary.userId !== userId) {
        throw new CustomError("Beneficiary not found", 404);
      }
      recipientCode = beneficiary.recipientCode;
      resolvedBankCode = beneficiary.bankCode;
      resolvedAccountNumber = beneficiary.accountNumber;
      resolvedAccountName = beneficiary.accountName;
    } else {
      if (!bankCode || !accountNumber || !accountName) {
        throw new CustomError("Bank details are required when no beneficiary is selected", 400);
      }
      resolvedBankCode = bankCode;
      resolvedAccountNumber = accountNumber;
      resolvedAccountName = accountName;
      recipientCode = await createTransferRecipient(accountName, accountNumber, bankCode);
    }

    const reference = `WDR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const balanceAfter = wallet.balance - amount;

    const transaction = new WalletTransaction(
      crypto.randomUUID(),
      wallet.id,
      TransactionType.DEBIT,
      amount,
      balanceAfter,
      TransactionStatus.PENDING,
      reference,
      "Wallet withdrawal",
      { bankCode: resolvedBankCode, accountNumber: resolvedAccountNumber, accountName: resolvedAccountName },
    );

    // TODO: i need to wrap the following two operations in a transaction to ensure atomicity
    await this.walletRepo.createTransaction(transaction);
    await this.walletRepo.updateBalance(wallet.id, balanceAfter);

    try {
      await initiateTransfer(amount, recipientCode, reference);

      try {
        transaction.status = TransactionStatus.COMPLETED;
        await this.walletRepo.createTransaction(transaction);
      } catch (error) {
        console.error("Failed to update transaction status to COMPLETED:", error);
      }
    } catch (error) {
      // Revert balance on failure
      await this.walletRepo.updateBalance(wallet.id, wallet.balance);
      transaction.status = TransactionStatus.FAILED;
      await this.walletRepo.createTransaction(transaction);
      throw new CustomError("Withdrawal failed. Please try again later.", 500);
    }

    return transaction;
  }

  async addBeneficiary(
    userId: string,
    bankCode: string,
    bankName: string,
    accountNumber: string,
    accountName: string,
  ): Promise<Beneficiary> {
    const existing = await this.walletRepo.findBeneficiaryByAccount(userId, bankCode, accountNumber);
    if (existing) {
      return existing;
    }

    const recipientCode = await createTransferRecipient(accountName, accountNumber, bankCode);

    const beneficiary = new Beneficiary(
      crypto.randomUUID(),
      userId,
      bankCode,
      bankName,
      accountNumber,
      accountName,
      recipientCode,
    );

    return this.walletRepo.createBeneficiary(beneficiary);
  }

  async getBeneficiaries(userId: string): Promise<Beneficiary[]> {
    return this.walletRepo.findBeneficiariesByUserId(userId);
  }

  async deleteBeneficiary(userId: string, beneficiaryId: string): Promise<void> {
    const beneficiary = await this.walletRepo.findBeneficiaryById(beneficiaryId);
    if (!beneficiary || beneficiary.userId !== userId) {
      throw new CustomError("Beneficiary not found", 404);
    }
    await this.walletRepo.deleteBeneficiary(beneficiaryId);
  }

  async resolveAccount(accountNumber: string, bankCode: string) {
    try {
      const resolved = await resolveAccountNumber(accountNumber, bankCode);
      return { accountName: resolved.account_name, accountNumber: resolved.account_number };
    } catch {
      throw new CustomError("Could not resolve account. Please verify the account number and bank.", 400);
    }
  }

  async getBanks(): Promise<PaystackBank[]> {
    return listBanks();
  }

  async getTransactionHistory(userId: string, page: number, limit: number) {
    const wallet = await this.getOrCreateWallet(userId);
    return this.walletRepo.findTransactionsByWalletId(wallet.id, page, limit);
  }
}
