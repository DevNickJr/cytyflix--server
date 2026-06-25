import { Express } from "express";

import { userRouter } from "@/modules/users/user.module";
import { authRouter } from "@/modules/auth/auth.module";
import { propertyRouter } from "@/modules/properties/property.module";
import { savedListingRouter } from "@/modules/saved-listings/saved-listing.module";
import { inquiryRouter } from "@/modules/inquiries/inquiry.module";
import { notificationRouter } from "@/modules/notifications/notification.module";
import { agentVerificationRouter } from "@/modules/agent-verifications/agent-verification.module";
import { reviewRouter } from "@/modules/reviews/review.module";
import { reportRouter, reportAdminRouter } from "@/modules/reports/report.module";
import { bookingRouter } from "@/modules/bookings/booking.module";
import { analyticsRouter } from "@/modules/analytics/analytics.module";

const V1 = '/api/v1'

export function registerRoutes(app: Express) {
  app.use(`${V1}/auth`, authRouter);
  app.use(`${V1}/users`, userRouter);
  app.use(`${V1}/properties`, propertyRouter);
  app.use(`${V1}/saved-listings`, savedListingRouter);
  app.use(`${V1}/inquiries`, inquiryRouter);
  app.use(`${V1}/notifications`, notificationRouter);
  app.use(`${V1}/agent-verifications`, agentVerificationRouter);
  app.use(`${V1}/properties`, reviewRouter);
  app.use(`${V1}/reports`, reportAdminRouter);
  app.use(`${V1}/properties`, reportRouter);
  app.use(`${V1}/bookings`, bookingRouter);
  app.use(`${V1}/analytics`, analyticsRouter);
}
