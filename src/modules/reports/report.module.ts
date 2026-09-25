import { ReportController } from './presentation/report.controller';
import { ReportService } from './application/report.service';
import { ReportRepositoryImpl } from './infrastructure/persistence/report.repository.impl';
import { ReportOrmEntity } from './infrastructure/persistence/report.orm-entity';
import { PropertyOrmEntity } from '@/modules/properties/infrastructure/persistence/property.orm-entity';
import { PropertyRepositoryImpl } from '@/modules/properties/infrastructure/persistence/property.repository.impl';
import { UserOrmEntity } from '@/modules/users/infrastructure/persistence/user.orm-entity';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/persistence/user.repository.impl';
import {
  reportPropertyRoutes,
  reportAdminRoutes,
} from './presentation/report.routes';
import { AppDataSource } from '@/infrastructure/database/app-data-source';

const ormRepo = AppDataSource.getRepository(ReportOrmEntity);
const propertyOrmRepo = AppDataSource.getRepository(PropertyOrmEntity);
const userOrmRepo = AppDataSource.getRepository(UserOrmEntity);
const reportRepository = new ReportRepositoryImpl(ormRepo);
const propertyRepository = new PropertyRepositoryImpl(propertyOrmRepo);
const userRepository = new UserRepositoryImpl(userOrmRepo);
const reportService = new ReportService(
  reportRepository,
  propertyRepository,
  userRepository
);
const reportController = new ReportController(reportService);

export const reportRouter = reportPropertyRoutes(reportController);
export const reportAdminRouter = reportAdminRoutes(reportController);
