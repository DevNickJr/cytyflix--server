import { Router } from 'express';
import { ReviewController } from './review.controller';
import { AuthGuard } from '@/shared/middlewares/auth.middleware';
import validateRequest from '@/shared/middlewares/validate-request';
import {
  CreateReviewSchema,
  IdAndPropertyIdParam,
  PropertyIdParam,
  UpdateReviewSchema,
} from '../contracts/review.schemas';

export const reviewRoutes = (controller: ReviewController) => {
  const router = Router();

  router.post(
    '/:propertyId/reviews',
    AuthGuard,
    validateRequest([PropertyIdParam, CreateReviewSchema]),
    controller.create
  );

  router.get('/:propertyId/reviews', controller.getByProperty);

  router.get('/:propertyId/reviews/summary', controller.getSummary);

  router.patch(
    '/:propertyId/reviews/:id',
    AuthGuard,
    validateRequest([IdAndPropertyIdParam, UpdateReviewSchema]),
    controller.update
  );

  router.delete('/:propertyId/reviews/:id', AuthGuard, controller.delete);

  return router;
};
