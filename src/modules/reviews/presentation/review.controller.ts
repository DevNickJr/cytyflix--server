import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../application/review.service";
import { RolesEnum } from "@/modules/users/contracts/user.interfaces";

export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.service.create(
        req.user!.id,
        req.params.propertyId as string,
        req.body,
      );
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  getByProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.service.getByProperty(req.params.propertyId as string, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await this.service.getSummary(req.params.propertyId as string);
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.service.update(
        req.params.id as string,
        req.user!.id,
        req.body,
      );
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(
        req.params.id as string,
        req.user!.id,
        req.user!.role as RolesEnum,
      );
      res.json({ success: true, message: "Review deleted" });
    } catch (error) {
      next(error);
    }
  };
}
