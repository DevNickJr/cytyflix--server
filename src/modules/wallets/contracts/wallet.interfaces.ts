import { Wallet, WalletTransaction, Beneficiary } from "../domain/wallet";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface WalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  create(wallet: Wallet): Promise<Wallet>;
  updateBalance(walletId: string, newBalance: number): Promise<Wallet>;
  createTransaction(tx: WalletTransaction): Promise<WalletTransaction>;
  findTransactionsByWalletId(walletId: string, page: number, limit: number): Promise<PaginatedResult<WalletTransaction>>;
  findTransactionByReference(reference: string): Promise<WalletTransaction | null>;
  createBeneficiary(beneficiary: Beneficiary): Promise<Beneficiary>;
  findBeneficiariesByUserId(userId: string): Promise<Beneficiary[]>;
  findBeneficiaryById(id: string): Promise<Beneficiary | null>;
  findBeneficiaryByAccount(userId: string, bankCode: string, accountNumber: string): Promise<Beneficiary | null>;
  deleteBeneficiary(id: string): Promise<void>;
}
