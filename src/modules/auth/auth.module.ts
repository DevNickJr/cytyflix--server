import { AuthController } from "./presentation/auth.controller";
import { AuthService } from "./application/auth.service";
import { UserRepositoryImpl } from "@/modules/users/infrastructure/persistence/user.repository.impl";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { authRoutes } from "./presentation/auth.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const ormRepo =
  AppDataSource.getRepository(UserOrmEntity);

const userRepository =
  new UserRepositoryImpl(ormRepo);

const authService =
  new AuthService(userRepository);

export const authController =
  new AuthController(authService);

export const authRouter =
  authRoutes(authController);
