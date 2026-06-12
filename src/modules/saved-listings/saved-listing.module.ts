import { SavedListingController } from "./presentation/saved-listing.controller";
import { SavedListingService } from "./application/saved-listing.service";
import { SavedListingRepositoryImpl } from "./infrastructure/persistence/saved-listing.repository.impl";
import { SavedListingOrmEntity } from "./infrastructure/persistence/saved-listing.orm-entity";
import { savedListingRoutes } from "./presentation/saved-listing.routes";
import { AppDataSource } from "@/infrastructure/database/app-data-source";

const ormRepo =
  AppDataSource.getRepository(SavedListingOrmEntity);

const savedListingRepository =
  new SavedListingRepositoryImpl(ormRepo);

const savedListingService =
  new SavedListingService(savedListingRepository);

export const savedListingController =
  new SavedListingController(savedListingService);

export const savedListingRouter =
  savedListingRoutes(savedListingController);
