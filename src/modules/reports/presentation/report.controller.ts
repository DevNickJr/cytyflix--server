import { Request, Response, NextFunction } from "express";
import { ReportService } from "../application/report.service";
import { PaginationQueryDTO } from "@/shared/schemas";

export class ReportController {
  constructor(private readonly service: ReportService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const report = await this.service.create(
        req.user!.id,
        req.params.propertyId as string,
        req.body,
      );
      res.status(201).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as PaginationQueryDTO;
      const status = req.query.status as string | undefined;
      const result = await this.service.getAll(status, query.page, query.limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  review = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const report = await this.service.review(
        req.params.id as string,
        req.user!.id,
        req.body,
      );
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  };
}
