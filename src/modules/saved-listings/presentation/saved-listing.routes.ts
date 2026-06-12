import { Router } from "express";
import { SavedListingController } from "./saved-listing.controller";
import { AuthGuard } from "@/shared/middlewares/auth.middleware";

export const savedListingRoutes = (controller: SavedListingController) => {
  const router = Router();

  router.post("/", AuthGuard, controller.toggleSave);
  router.get("/", AuthGuard, controller.getMyListings);
  router.get("/:propertyId/status", AuthGuard, controller.checkStatus);

  return router;
};
