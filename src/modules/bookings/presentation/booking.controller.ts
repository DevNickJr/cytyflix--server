import { Request, Response, NextFunction } from "express";
import { BookingService } from "../application/booking.service";

export class BookingController {
  constructor(private readonly service: BookingService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createBooking(req.user!.id, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["x-paystack-signature"] as string;
      const rawBody = JSON.stringify(req.body);
      await this.service.handleWebhook(rawBody, signature);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = (req.query.role as string) || "client";
      const result = await this.service.getMyBookings(req.user!.id, role as "client" | "agent", page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.getBooking(req.params.id as string, req.user!.id);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  };

  confirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.confirmMeeting(req.params.id as string, req.user!.id);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.cancelBooking(req.params.id as string, req.user!.id);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  };
}
