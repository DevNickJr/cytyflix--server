import { Express } from "express";

import { userRouter } from "@/modules/users/user.module";
import { authRouter } from "@/modules/auth/auth.module";
import { propertyRouter } from "@/modules/properties/property.module";
import { savedListingRouter } from "@/modules/saved-listings/saved-listing.module";
import { inquiryRouter } from "@/modules/inquiries/inquiry.module";
import { notificationRouter } from "@/modules/notifications/notification.module";

const V1 = '/api/v1'

export function registerRoutes(app: Express) {
  app.use(`${V1}/auth`, authRouter);
  app.use(`${V1}/users`, userRouter);
  app.use(`${V1}/properties`, propertyRouter);
  app.use(`${V1}/saved-listings`, savedListingRouter);
  app.use(`${V1}/inquiries`, inquiryRouter);
  app.use(`${V1}/notifications`, notificationRouter);
}
