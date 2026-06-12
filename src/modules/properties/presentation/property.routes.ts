import { Router } from "express";
import { PropertyController } from "./property.controller";
import { AuthGuard, RoleGuard } from "@/shared/middlewares/auth.middleware";
import { RolesEnum } from "@/modules/users/contracts/user.interfaces";
import validateRequest from "@/shared/middlewares/validate-request";
import { CreatePropertySchema, SearchPropertyQuerySchema, UpdatePropertySchema } from "../contracts/property.schemas";
import { IdParam, PaginationQuerySchema } from "@/shared/schemas";

export const propertyRoutes = (controller: PropertyController) => {
  const router = Router();

  // Public routes
  router.get("/", validateRequest([SearchPropertyQuerySchema]), controller.search);

  // Protected routes (before /:id to avoid conflicts)
  router.post(
    "/",
    AuthGuard,
    RoleGuard([RolesEnum.PROPERTY_OWNER, RolesEnum.AGENT, RolesEnum.ADMIN]),
    validateRequest([CreatePropertySchema]),
    controller.create
  );
  router.get("/me", AuthGuard, validateRequest([PaginationQuerySchema]), controller.getMyListings);
  router.patch("/:id", AuthGuard, validateRequest([UpdatePropertySchema, IdParam]), controller.update);
  router.delete("/:id", AuthGuard, validateRequest([IdParam]), controller.delete);

  // Public param route (after specific routes)
  router.get("/:id", controller.getOne);

  return router;
};
