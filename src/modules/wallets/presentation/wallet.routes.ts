import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { AuthGuard } from "@/shared/middlewares/auth.middleware";
import validateRequest from "@/shared/middlewares/validate-request";
import { WithdrawSchema, AddBeneficiarySchema, ResolveAccountSchema } from "../contracts/wallet.schemas";
import { IdParam } from "@/shared/schemas";

export const walletRoutes = (controller: WalletController) => {
  const router = Router();

  router.get("/", AuthGuard, controller.getBalance);

  router.post(
    "/withdraw",
    AuthGuard,
    validateRequest([WithdrawSchema]),
    controller.withdraw,
  );

  router.get("/banks", AuthGuard, controller.getBanks);

  router.get(
    "/resolve-account",
    AuthGuard,
    validateRequest([ResolveAccountSchema]),
    controller.resolveAccount,
  );

  router.get("/beneficiaries", AuthGuard, controller.getBeneficiaries);

  router.post(
    "/beneficiaries",
    AuthGuard,
    validateRequest([AddBeneficiarySchema]),
    controller.addBeneficiary,
  );

  router.delete(
    "/beneficiaries/:id",
    AuthGuard,
    validateRequest([IdParam]),
    controller.deleteBeneficiary,
  );

  router.get("/transactions", AuthGuard, controller.getTransactions);

  return router;
};
