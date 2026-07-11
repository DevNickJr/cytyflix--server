import { RentPaymentController } from "./presentation/rent-payment.controller";
import { RentPaymentService } from "./application/rent-payment.service";
import { RentPaymentRepositoryImpl } from "./infrastructure/persistence/rent-payment.repository.impl";
import { RentPaymentOrmEntity } from "./infrastructure/persistence/rent-payment.orm-entity";
import { rentPaymentRoutes } from "./presentation/rent-payment.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";
import { UserRepositoryImpl } from "@/modules/users/infrastructure/persistence/user.repository.impl";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { walletService } from "@/modules/wallets/wallet.module";

const rentPaymentOrmRepo = AppDataSource.getRepository(RentPaymentOrmEntity);
const rentPaymentRepository = new RentPaymentRepositoryImpl(rentPaymentOrmRepo);

const userOrmRepo = AppDataSource.getRepository(UserOrmEntity);
const userRepository = new UserRepositoryImpl(userOrmRepo);

export const rentPaymentService = new RentPaymentService(rentPaymentRepository, userRepository, walletService);
const rentPaymentController = new RentPaymentController(rentPaymentService);

export const rentPaymentRouter = rentPaymentRoutes(rentPaymentController);
