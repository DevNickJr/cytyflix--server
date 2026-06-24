import { Router } from "express";
import express from "express";
import { BookingController } from "./booking.controller";
import { AuthGuard } from "@/shared/middlewares/auth.middleware";
import validateRequest from "@/shared/middlewares/validate-request";
import { CreateBookingSchema } from "../contracts/booking.schemas";
import { IdParam } from "@/shared/schemas";

export const bookingRoutes = (controller: BookingController) => {
  const router = Router();

  router.post(
    "/",
    AuthGuard,
    validateRequest([CreateBookingSchema]),
    controller.create,
  );

  router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    controller.webhook,
  );

  router.get("/", AuthGuard, controller.getMyBookings);

  router.get(
    "/:id",
    AuthGuard,
    validateRequest([IdParam]),
    controller.getOne,
  );

  router.post(
    "/:id/confirm",
    AuthGuard,
    validateRequest([IdParam]),
    controller.confirm,
  );

  router.post(
    "/:id/cancel",
    AuthGuard,
    validateRequest([IdParam]),
    controller.cancel,
  );

  return router;
};
