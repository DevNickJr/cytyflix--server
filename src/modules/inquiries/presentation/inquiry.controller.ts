import { Request, Response, NextFunction } from "express";
import { InquiryService } from "../application/inquiry.service";

export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inquiry = await this.inquiryService.createInquiry(req.user!.id, req.body);
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  };

  getSent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.inquiryService.getMyInquiries(req.user!.id, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getReceived = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.inquiryService.getReceivedInquiries(req.user!.id, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inquiry = await this.inquiryService.updateInquiryStatus(
        req.params.id as string,
        req.user!.id,
        req.body.status,
      );
      res.json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  };
}
