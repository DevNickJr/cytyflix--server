import { PropertyController } from "./presentation/property.controller";
import { PropertyService } from "./application/property.service";
import { PropertyRepositoryImpl } from "./infrastructure/persistence/property.repository.impl";
import { PropertyOrmEntity } from "./infrastructure/persistence/property.orm-entity";
import { propertyRoutes } from "./presentation/property.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const ormRepo =
  AppDataSource.getRepository(PropertyOrmEntity);

const propertyRepository =
  new PropertyRepositoryImpl(ormRepo);

const propertyService =
  new PropertyService(propertyRepository);

export const propertyController =
  new PropertyController(propertyService);

export const propertyRouter =
  propertyRoutes(propertyController);
