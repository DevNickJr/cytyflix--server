import { UserController } from "./presentation/user.controller";
import { UserService } from "./application/user.service";
import { UserRepositoryImpl } from "./infrastructure/persistence/user.repository.impl";
import { UserOrmEntity } from "./infrastructure/persistence/user.orm-entity";
import { userRoutes } from "./presentation/user.routes";

import { AppDataSource } from "@/infrastructure/database/app-data-source";

const ormRepo =
  AppDataSource.getRepository(UserOrmEntity);

const userRepository =
  new UserRepositoryImpl(ormRepo);

const userService =
  new UserService(userRepository);

export const userController =
  new UserController(userService);

export const userRouter =
  userRoutes(userController);