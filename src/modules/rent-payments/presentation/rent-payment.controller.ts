import { Request, Response, NextFunction } from "express";
import { RentPaymentService } from "../application/rent-payment.service";

export class RentPaymentController {
  constructor(private readonly service: RentPaymentService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["x-paystack-signature"] as string;
      const rawBody = (req as any).rawBody;
      if (!rawBody) throw new Error("Raw body required");
      await this.service.handleWebhook(rawBody, signature);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = (req.query.role as string) || "tenant";
      const result = await this.service.getMyPayments(req.user!.id, role as "tenant" | "owner", page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.service.getPayment(req.params.id as string, req.user!.id);
      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  };

  confirmMoveIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.service.confirmMoveIn(req.params.id as string, req.user!.id);
      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  };

  dispute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.service.dispute(req.params.id as string, req.user!.id);
      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  };
}
