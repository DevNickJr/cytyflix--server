import { AnalyticsEventController } from "./presentation/analytics-event.controller";
import { AnalyticsEventService } from "./application/analytics-event.service";
import { AnalyticsEventRepositoryImpl } from "./infrastructure/persistence/analytics-event.repository.impl";
import { AnalyticsEventOrmEntity } from "./infrastructure/persistence/analytics-event.orm-entity";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";
import { ReviewOrmEntity } from "@/modules/reviews/infrastructure/persistence/review.orm-entity";
import { analyticsRoutes } from "./presentation/analytics-event.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const analyticsOrmRepo = AppDataSource.getRepository(AnalyticsEventOrmEntity);
const propertyOrmRepo = AppDataSource.getRepository(PropertyOrmEntity);
const reviewOrmRepo = AppDataSource.getRepository(ReviewOrmEntity);

const analyticsRepository = new AnalyticsEventRepositoryImpl(
  analyticsOrmRepo,
  propertyOrmRepo,
  reviewOrmRepo,
);

const analyticsService = new AnalyticsEventService(analyticsRepository);
const analyticsController = new AnalyticsEventController(analyticsService);

export const analyticsRouter = analyticsRoutes(analyticsController);
