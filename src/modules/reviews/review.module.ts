import { ReviewController } from "./presentation/review.controller";
import { ReviewService } from "./application/review.service";
import { ReviewRepositoryImpl } from "./infrastructure/persistence/review.repository.impl";
import { ReviewOrmEntity } from "./infrastructure/persistence/review.orm-entity";
import { reviewRoutes } from "./presentation/review.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";
import { PropertyRepositoryImpl } from "@/modules/properties/infrastructure/persistence/property.repository.impl";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";

const reviewOrmRepo = AppDataSource.getRepository(ReviewOrmEntity);
const reviewRepository = new ReviewRepositoryImpl(reviewOrmRepo);

const propertyOrmRepo = AppDataSource.getRepository(PropertyOrmEntity);
const propertyRepository = new PropertyRepositoryImpl(propertyOrmRepo);

const reviewService = new ReviewService(reviewRepository, propertyRepository);
const reviewController = new ReviewController(reviewService);

export const reviewRouter = reviewRoutes(reviewController);
