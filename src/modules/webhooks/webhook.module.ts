import { WebhookController } from "./presentation/webhook.controller";
import { WebhookService } from "./application/webhook.service";
import { walletRoutes } from "./presentation/webhook.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";
import { UserRepositoryImpl } from "@/modules/users/infrastructure/persistence/user.repository.impl";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { BookingOrmEntity } from "../bookings/infrastructure/persistence/booking.orm-entity";
import { BookingRepositoryImpl } from "../bookings/infrastructure/persistence/booking.repository.impl";

const bookingOrmRepo = AppDataSource.getRepository(BookingOrmEntity);
const bookingRepository = new BookingRepositoryImpl(bookingOrmRepo);

const userOrmRepo = AppDataSource.getRepository(UserOrmEntity);
const userRepository = new UserRepositoryImpl(userOrmRepo);


// const walletOrmRepo = AppDataSource.getRepository(WalletOrmEntity);
// const transactionOrmRepo = AppDataSource.getRepository(WalletTransactionOrmEntity);
// const walletRepository = new WalletRepositoryImpl(walletOrmRepo, transactionOrmRepo);

export const webhookService = new WebhookService(bookingRepository, userRepository);
const webhookController = new WebhookController(webhookService);

export const walletRouter = walletRoutes(webhookController);
