import { InquiryController } from "./presentation/inquiry.controller";
import { InquiryService } from "./application/inquiry.service";
import { InquiryRepositoryImpl } from "./infrastructure/persistence/inquiry.repository.impl";
import { InquiryOrmEntity } from "./infrastructure/persistence/inquiry.orm-entity";
import { PropertyRepositoryImpl } from "@/modules/properties/infrastructure/persistence/property.repository.impl";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";
import { UserRepositoryImpl } from "@/modules/users/infrastructure/persistence/user.repository.impl";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { inquiryRoutes } from "./presentation/inquiry.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const inquiryOrmRepo =
  AppDataSource.getRepository(InquiryOrmEntity);

const propertyOrmRepo =
  AppDataSource.getRepository(PropertyOrmEntity);

const userOrmRepo =
  AppDataSource.getRepository(UserOrmEntity);

const inquiryRepository =
  new InquiryRepositoryImpl(inquiryOrmRepo);

const propertyRepository =
  new PropertyRepositoryImpl(propertyOrmRepo);

const userRepository =
  new UserRepositoryImpl(userOrmRepo);

const inquiryService =
  new InquiryService(inquiryRepository, propertyRepository, userRepository);

export const inquiryController =
  new InquiryController(inquiryService);

export const inquiryRouter =
  inquiryRoutes(inquiryController);
