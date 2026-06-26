import { WalletController } from "./presentation/wallet.controller";
import { WalletService } from "./application/wallet.service";
import { WalletRepositoryImpl } from "./infrastructure/persistence/wallet.repository.impl";
import { WalletOrmEntity } from "./infrastructure/persistence/wallet.orm-entity";
import { WalletTransactionOrmEntity } from "./infrastructure/persistence/wallet-transaction.orm-entity";
import { BeneficiaryOrmEntity } from "./infrastructure/persistence/beneficiary.orm-entity";
import { walletRoutes } from "./presentation/wallet.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const walletOrmRepo = AppDataSource.getRepository(WalletOrmEntity);
const transactionOrmRepo = AppDataSource.getRepository(WalletTransactionOrmEntity);
const beneficiaryOrmRepo = AppDataSource.getRepository(BeneficiaryOrmEntity);
const walletRepository = new WalletRepositoryImpl(walletOrmRepo, transactionOrmRepo, beneficiaryOrmRepo);

export const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

export const walletRouter = walletRoutes(walletController);
