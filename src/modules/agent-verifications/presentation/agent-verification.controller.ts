import { Request, Response, NextFunction } from "express";
import { AgentVerificationService } from "../application/agent-verification.service";
import { PaginationQueryDTO } from "@/shared/schemas";

export class AgentVerificationController {
  constructor(private readonly service: AgentVerificationService) {}

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verification = await this.service.submit(req.user!.id, req.body);
      res.status(201).json({ success: true, data: verification });
    } catch (error) {
      next(error);
    }
  };

  getMyVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verification = await this.service.getMyVerification(req.user!.id);
      res.json({ success: true, data: verification });
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

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verification = await this.service.getOne(req.params.id as string);
      res.json({ success: true, data: verification });
    } catch (error) {
      next(error);
    }
  };

  review = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verification = await this.service.review(
        req.params.id as string,
        req.user!.id,
        req.body,
      );
      res.json({ success: true, data: verification });
    } catch (error) {
      next(error);
    }
  };
}
