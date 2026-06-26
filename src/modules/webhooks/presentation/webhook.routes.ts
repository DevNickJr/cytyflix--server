import { Router } from "express";
import { WebhookController } from "./webhook.controller";

export const walletRoutes = (controller: WebhookController) => {
  const router = Router();

  router.post(
    "/payment",
    controller.paymentWebhook
  );

  return router;
};
