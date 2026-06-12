import { NotificationController } from "./presentation/notification.controller";
import { NotificationService } from "./application/notification.service";
import { NotificationRepositoryImpl } from "./infrastructure/persistence/notification.repository.impl";
import { NotificationOrmEntity } from "./infrastructure/persistence/notification.orm-entity";
import { notificationRoutes } from "./presentation/notification.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const ormRepo =
  AppDataSource.getRepository(NotificationOrmEntity);

const notificationRepository =
  new NotificationRepositoryImpl(ormRepo);

export const notificationService =
  new NotificationService(notificationRepository);

export const notificationController =
  new NotificationController(notificationService);

export const notificationRouter =
  notificationRoutes(notificationController);
