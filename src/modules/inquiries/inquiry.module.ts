import { InquiryController } from "./presentation/inquiry.controller";
import { InquiryService } from "./application/inquiry.service";
import { InquiryRepositoryImpl } from "./infrastructure/persistence/inquiry.repository.impl";
import { InquiryOrmEntity } from "./infrastructure/persistence/inquiry.orm-entity";
import { PropertyRepositoryImpl } from "@/modules/properties/infrastructure/persistence/property.repository.impl";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";
import { inquiryRoutes } from "./presentation/inquiry.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const inquiryOrmRepo =
  AppDataSource.getRepository(InquiryOrmEntity);

const propertyOrmRepo =
  AppDataSource.getRepository(PropertyOrmEntity);

const inquiryRepository =
  new InquiryRepositoryImpl(inquiryOrmRepo);

const propertyRepository =
  new PropertyRepositoryImpl(propertyOrmRepo);

const inquiryService =
  new InquiryService(inquiryRepository, propertyRepository);

export const inquiryController =
  new InquiryController(inquiryService);

export const inquiryRouter =
  inquiryRoutes(inquiryController);
