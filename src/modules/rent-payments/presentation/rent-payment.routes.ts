import { Router } from 'express';
import express from 'express';
import { RentPaymentController } from './rent-payment.controller';
import { AuthGuard } from '@/shared/middlewares/auth.middleware';
import validateRequest from '@/shared/middlewares/validate-request';
import { CreateRentPaymentSchema } from '../contracts/rent-payment.schemas';
import { IdParam } from '@/shared/schemas';

export const rentPaymentRoutes = (controller: RentPaymentController) => {
  const router = Router();

  router.post(
    '/',
    AuthGuard,
    validateRequest([CreateRentPaymentSchema]),
    controller.create
  );

  router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    controller.webhook
  );

  router.get('/', AuthGuard, controller.getMyPayments);

  router.get('/:id', AuthGuard, validateRequest([IdParam]), controller.getOne);

  router.post(
    '/:id/confirm-move-in',
    AuthGuard,
    validateRequest([IdParam]),
    controller.confirmMoveIn
  );

  router.post(
    '/:id/dispute',
    AuthGuard,
    validateRequest([IdParam]),
    controller.dispute
  );

  return router;
};
