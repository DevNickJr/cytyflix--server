import { Request, Response, NextFunction } from "express";
import { BookingService } from "../application/booking.service";
import { generateICSContent } from "@/shared/utils/ics-generator";
import { generateReceiptPDF } from "@/shared/utils/receipt-generator";

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

  agentConfirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.agentConfirm(req.params.id as string, req.user!.id);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  };

  clientRelease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.clientRelease(req.params.id as string, req.user!.id);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  };

  updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.updateSchedule(req.params.id as string, req.user!.id, req.body);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.rejectBooking(req.params.id as string, req.user!.id);
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

  downloadICS = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await this.service.getBooking(req.params.id as string, req.user!.id);

      const ics = generateICSContent({
        uid: `booking-${booking.id}@cytyflix.com`,
        title: `CytyFlix Booking - ${booking.paymentReference}`,
        description: `Property inspection booking. Reference: ${booking.paymentReference}`,
        startDate: new Date(booking.scheduledDate),
        startTime: booking.scheduledTime,
        durationMinutes: 60,
      });

      res.setHeader("Content-Type", "text/calendar; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="booking-${booking.paymentReference}.ics"`);
      res.send(ics);
    } catch (error) {
      next(error);
    }
  };

  downloadReceipt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const receiptData = await this.service.getReceiptData(req.params.id as string, req.user!.id);
      const pdf = await generateReceiptPDF(receiptData);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="receipt-${receiptData.bookingReference}.pdf"`);
      res.send(pdf);
    } catch (error) {
      next(error);
    }
  };
}
