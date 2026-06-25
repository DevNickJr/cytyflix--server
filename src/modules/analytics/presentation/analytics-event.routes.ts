import { Router } from "express";
import { AnalyticsEventController } from "./analytics-event.controller";
import { OptionalAuthGuard } from "@/shared/middlewares/auth.middleware";
import validateRequest from "@/shared/middlewares/validate-request";
import { TrackEventSchema, PopularQuerySchema } from "../contracts/analytics-event.schemas";

export const analyticsRoutes = (controller: AnalyticsEventController) => {
  const router = Router();

  router.post(
    "/events",
    OptionalAuthGuard,
    validateRequest([TrackEventSchema]),
    controller.trackEvent,
  );

  router.get("/properties/:id/views", controller.getPropertyViews);

  router.get(
    "/popular",
    validateRequest([PopularQuerySchema]),
    controller.getPopular,
  );

  router.get("/agents/:id/stats", controller.getAgentStats);

  return router;
};
