import { Request, Response, NextFunction } from "express";
import { WebhookService } from "../application/webhook.service";

export class WebhookController {
  constructor(private readonly service: WebhookService) {}
 
  paymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["x-paystack-signature"] as string;
      const rawBody = (req as any).rawBody;

      if (!rawBody) {
        throw new Error("Raw body is required for webhook verification");
      }
      await this.service.handleWebhook(rawBody, signature);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

}
