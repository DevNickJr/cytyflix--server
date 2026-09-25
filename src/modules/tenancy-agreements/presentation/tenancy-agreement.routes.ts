import { Router } from 'express';
import { TenancyAgreementController } from './tenancy-agreement.controller';
import { AuthGuard } from '@/shared/middlewares/auth.middleware';
import validateRequest from '@/shared/middlewares/validate-request';
import { IdParam } from '@/shared/schemas';
import {
  CreateAgreementSchema,
  SignAgreementSchema,
} from '../contracts/tenancy-agreement.schemas';

export function createTenancyAgreementRoutes(
  controller: TenancyAgreementController
): Router {
  const router = Router();

  router.post(
    '/',
    AuthGuard,
    validateRequest([CreateAgreementSchema]),
    controller.create
  );

  router.get('/', AuthGuard, controller.getMyAgreements);

  router.get('/:id', AuthGuard, validateRequest([IdParam]), controller.getOne);

  router.post(
    '/:id/sign-landlord',
    AuthGuard,
    validateRequest([IdParam, SignAgreementSchema]),
    controller.signAsLandlord
  );

  router.post(
    '/:id/sign-tenant',
    AuthGuard,
    validateRequest([IdParam, SignAgreementSchema]),
    controller.signAsTenant
  );

  router.get(
    '/:id/download',
    AuthGuard,
    validateRequest([IdParam]),
    controller.downloadPDF
  );

  return router;
}
