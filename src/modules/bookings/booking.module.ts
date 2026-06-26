import { BookingController } from "./presentation/booking.controller";
import { BookingService } from "./application/booking.service";
import { BookingRepositoryImpl } from "./infrastructure/persistence/booking.repository.impl";
import { BookingOrmEntity } from "./infrastructure/persistence/booking.orm-entity";
import { bookingRoutes } from "./presentation/booking.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";
import { UserRepositoryImpl } from "@/modules/users/infrastructure/persistence/user.repository.impl";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { walletService } from "@/modules/wallets/wallet.module";

const bookingOrmRepo = AppDataSource.getRepository(BookingOrmEntity);
const bookingRepository = new BookingRepositoryImpl(bookingOrmRepo);

const userOrmRepo = AppDataSource.getRepository(UserOrmEntity);
const userRepository = new UserRepositoryImpl(userOrmRepo);

const bookingService = new BookingService(bookingRepository, userRepository, walletService);
const bookingController = new BookingController(bookingService);

export const bookingRouter = bookingRoutes(bookingController);
