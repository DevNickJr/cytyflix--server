import { ReportController } from "./presentation/report.controller";
import { ReportService } from "./application/report.service";
import { ReportRepositoryImpl } from "./infrastructure/persistence/report.repository.impl";
import { ReportOrmEntity } from "./infrastructure/persistence/report.orm-entity";
import { reportPropertyRoutes, reportAdminRoutes } from "./presentation/report.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const ormRepo = AppDataSource.getRepository(ReportOrmEntity);
const reportRepository = new ReportRepositoryImpl(ormRepo);
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);

export const reportRouter = reportPropertyRoutes(reportController);
export const reportAdminRouter = reportAdminRoutes(reportController);
