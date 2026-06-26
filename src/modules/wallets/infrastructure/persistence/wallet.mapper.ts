import { Wallet, WalletTransaction, Beneficiary, TransactionType, TransactionStatus } from "../../domain/wallet";
import { WalletOrmEntity } from "./wallet.orm-entity";
import { WalletTransactionOrmEntity } from "./wallet-transaction.orm-entity";
import { BeneficiaryOrmEntity } from "./beneficiary.orm-entity";

export class WalletMapper {
  static toDomain(entity: WalletOrmEntity): Wallet {
    return new Wallet(
      entity.id,
      entity.userId,
      Number(entity.balance),
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(wallet: Wallet): WalletOrmEntity {
    const entity = new WalletOrmEntity();
    entity.id = wallet.id;
    entity.userId = wallet.userId;
    entity.balance = wallet.balance;
    entity.createdAt = wallet.createdAt;
    entity.updatedAt = wallet.updatedAt;
    return entity;
  }
}

export class BeneficiaryMapper {
  static toDomain(entity: BeneficiaryOrmEntity): Beneficiary {
    return new Beneficiary(
      entity.id,
      entity.userId,
      entity.bankCode,
      entity.bankName,
      entity.accountNumber,
      entity.accountName,
      entity.recipientCode,
      entity.createdAt,
    );
  }

  static toPersistence(b: Beneficiary): BeneficiaryOrmEntity {
    const entity = new BeneficiaryOrmEntity();
    entity.id = b.id;
    entity.userId = b.userId;
    entity.bankCode = b.bankCode;
    entity.bankName = b.bankName;
    entity.accountNumber = b.accountNumber;
    entity.accountName = b.accountName;
    entity.recipientCode = b.recipientCode;
    entity.createdAt = b.createdAt;
    return entity;
  }
}

export class WalletTransactionMapper {
  static toDomain(entity: WalletTransactionOrmEntity): WalletTransaction {
    return new WalletTransaction(
      entity.id,
      entity.walletId,
      entity.type as TransactionType,
      Number(entity.amount),
      Number(entity.balanceAfter),
      entity.status as TransactionStatus,
      entity.reference,
      entity.description,
      entity.metadata,
      entity.createdAt,
    );
  }

  static toPersistence(tx: WalletTransaction): WalletTransactionOrmEntity {
    const entity = new WalletTransactionOrmEntity();
    entity.id = tx.id;
    entity.walletId = tx.walletId;
    entity.type = tx.type;
    entity.amount = tx.amount;
    entity.balanceAfter = tx.balanceAfter;
    entity.status = tx.status;
    entity.reference = tx.reference;
    entity.description = tx.description;
    entity.metadata = tx.metadata;
    entity.createdAt = tx.createdAt;
    return entity;
  }
}
