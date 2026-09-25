import { Router } from 'express';
import express from 'express';
import { BookingController } from './booking.controller';
import { AuthGuard, RoleGuard } from '@/shared/middlewares/auth.middleware';
import validateRequest from '@/shared/middlewares/validate-request';
import {
  CreateBookingSchema,
  UpdateBookingScheduleSchema,
} from '../contracts/booking.schemas';
import { IdParam } from '@/shared/schemas';
import { RolesEnum } from '@/modules/users/contracts/user.interfaces';

export const bookingRoutes = (controller: BookingController) => {
  const router = Router();

  router.post(
    '/',
    AuthGuard,
    validateRequest([CreateBookingSchema]),
    controller.create
  );

  router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    controller.webhook
  );

  router.get('/', AuthGuard, controller.getMyBookings);

  router.get('/:id', AuthGuard, validateRequest([IdParam]), controller.getOne);

  router.post(
    '/:id/agent-confirm',
    AuthGuard,
    RoleGuard([RolesEnum.AGENT]),
    validateRequest([IdParam]),
    controller.agentConfirm
  );

  router.post(
    '/:id/client-release',
    AuthGuard,
    validateRequest([IdParam]),
    controller.clientRelease
  );

  router.patch(
    '/:id',
    AuthGuard,
    validateRequest([IdParam, UpdateBookingScheduleSchema]),
    controller.updateSchedule
  );

  router.post(
    '/:id/reject',
    AuthGuard,
    validateRequest([IdParam]),
    controller.reject
  );

  router.post(
    '/:id/cancel',
    AuthGuard,
    validateRequest([IdParam]),
    controller.cancel
  );

  router.get(
    '/:id/calendar.ics',
    AuthGuard,
    validateRequest([IdParam]),
    controller.downloadICS
  );

  router.get(
    '/:id/receipt',
    AuthGuard,
    validateRequest([IdParam]),
    controller.downloadReceipt
  );

  return router;
};
