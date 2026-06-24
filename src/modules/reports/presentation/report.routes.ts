import { Router } from "express";
import { ReportController } from "./report.controller";
import { AuthGuard, RoleGuard } from "@/shared/middlewares/auth.middleware";
import { RolesEnum } from "@/modules/users/contracts/user.interfaces";
import validateRequest from "@/shared/middlewares/validate-request";
import { CreateReportSchema, ReviewReportSchema } from "../contracts/report.schemas";
import { PaginationQuerySchema, IdParam } from "@/shared/schemas";

export const reportPropertyRoutes = (controller: ReportController) => {
  const router = Router();

  router.post(
    "/:propertyId/reports",
    AuthGuard,
    validateRequest([CreateReportSchema]),
    controller.create,
  );

  return router;
};

export const reportAdminRoutes = (controller: ReportController) => {
  const router = Router();

  router.get(
    "/",
    AuthGuard,
    RoleGuard([RolesEnum.ADMIN]),
    validateRequest([PaginationQuerySchema]),
    controller.getAll,
  );

  router.patch(
    "/:id",
    AuthGuard,
    RoleGuard([RolesEnum.ADMIN]),
    validateRequest([IdParam, ReviewReportSchema]),
    controller.review,
  );

  return router;
};
