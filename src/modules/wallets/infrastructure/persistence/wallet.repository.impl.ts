import { Repository } from "typeorm";
import { WalletRepository } from "../../contracts/wallet.interfaces";
import { Wallet, WalletTransaction, Beneficiary } from "../../domain/wallet";
import { WalletOrmEntity } from "./wallet.orm-entity";
import { WalletTransactionOrmEntity } from "./wallet-transaction.orm-entity";
import { BeneficiaryOrmEntity } from "./beneficiary.orm-entity";
import { WalletMapper, WalletTransactionMapper, BeneficiaryMapper } from "./wallet.mapper";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export class WalletRepositoryImpl implements WalletRepository {
  constructor(
    private readonly walletOrmRepo: Repository<WalletOrmEntity>,
    private readonly transactionOrmRepo: Repository<WalletTransactionOrmEntity>,
    private readonly beneficiaryOrmRepo: Repository<BeneficiaryOrmEntity>,
  ) {}

  async findByUserId(userId: string): Promise<Wallet | null> {
    const entity = await this.walletOrmRepo.findOne({ where: { userId } });
    if (!entity) return null;
    return WalletMapper.toDomain(entity);
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const entity = WalletMapper.toPersistence(wallet);
    const saved = await this.walletOrmRepo.save(entity);
    return WalletMapper.toDomain(saved);
  }

  async updateBalance(walletId: string, newBalance: number): Promise<Wallet> {
    await this.walletOrmRepo.update(walletId, {
      balance: newBalance,
      updatedAt: new Date(),
    });
    const updated = await this.walletOrmRepo.findOneOrFail({ where: { id: walletId } });
    return WalletMapper.toDomain(updated);
  }

  async createTransaction(tx: WalletTransaction): Promise<WalletTransaction> {
    const entity = WalletTransactionMapper.toPersistence(tx);
    const saved = await this.transactionOrmRepo.save(entity);
    return WalletTransactionMapper.toDomain(saved);
  }

  async findTransactionsByWalletId(walletId: string, page: number, limit: number): Promise<PaginatedResult<WalletTransaction>> {
    const [entities, total] = await this.transactionOrmRepo.findAndCount({
      where: { walletId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map(WalletTransactionMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTransactionByReference(reference: string): Promise<WalletTransaction | null> {
    const entity = await this.transactionOrmRepo.findOne({ where: { reference } });
    if (!entity) return null;
    return WalletTransactionMapper.toDomain(entity);
  }

  async createBeneficiary(beneficiary: Beneficiary): Promise<Beneficiary> {
    const entity = BeneficiaryMapper.toPersistence(beneficiary);
    const saved = await this.beneficiaryOrmRepo.save(entity);
    return BeneficiaryMapper.toDomain(saved);
  }

  async findBeneficiariesByUserId(userId: string): Promise<Beneficiary[]> {
    const entities = await this.beneficiaryOrmRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    return entities.map(BeneficiaryMapper.toDomain);
  }

  async findBeneficiaryById(id: string): Promise<Beneficiary | null> {
    const entity = await this.beneficiaryOrmRepo.findOne({ where: { id } });
    if (!entity) return null;
    return BeneficiaryMapper.toDomain(entity);
  }

  async findBeneficiaryByAccount(userId: string, bankCode: string, accountNumber: string): Promise<Beneficiary | null> {
    const entity = await this.beneficiaryOrmRepo.findOne({
      where: { userId, bankCode, accountNumber },
    });
    if (!entity) return null;
    return BeneficiaryMapper.toDomain(entity);
  }

  async deleteBeneficiary(id: string): Promise<void> {
    await this.beneficiaryOrmRepo.delete(id);
  }
}
