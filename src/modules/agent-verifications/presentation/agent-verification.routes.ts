import { Router } from "express";
import { AgentVerificationController } from "./agent-verification.controller";
import { AuthGuard, RoleGuard } from "@/shared/middlewares/auth.middleware";
import { RolesEnum } from "@/modules/users/contracts/user.interfaces";
import validateRequest from "@/shared/middlewares/validate-request";
import { SubmitVerificationSchema, ReviewVerificationSchema } from "../contracts/agent-verification.schemas";
import { PaginationQuerySchema, IdParam } from "@/shared/schemas";

export const agentVerificationRoutes = (controller: AgentVerificationController) => {
  const router = Router();

  router.post(
    "/",
    AuthGuard,
    validateRequest([SubmitVerificationSchema]),
    controller.submit,
  );

  router.get("/me", AuthGuard, controller.getMyVerification);

  router.get(
    "/",
    AuthGuard,
    RoleGuard([RolesEnum.ADMIN]),
    validateRequest([PaginationQuerySchema]),
    controller.getAll,
  );

  router.get(
    "/:id",
    AuthGuard,
    RoleGuard([RolesEnum.ADMIN]),
    validateRequest([IdParam]),
    controller.getOne,
  );

  router.patch(
    "/:id/review",
    AuthGuard,
    RoleGuard([RolesEnum.ADMIN]),
    validateRequest([IdParam, ReviewVerificationSchema]),
    controller.review,
  );

  return router;
};
