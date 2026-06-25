import { Request, Response, NextFunction } from "express";
import { AnalyticsEventService } from "../application/analytics-event.service";
import { EventType } from "../domain/analytics-event";

export class AnalyticsEventController {
  constructor(private readonly analyticsService: AnalyticsEventService) {}

  trackEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eventType, targetId, metadata } = req.body;
      const userId = req.user?.id;
      await this.analyticsService.trackEvent(
        eventType as EventType,
        targetId,
        userId,
        metadata,
      );
      res.status(201).json({ success: true, message: "Event tracked" });
    } catch (error) {
      next(error);
    }
  };

  getPropertyViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.analyticsService.getPropertyViews(req.params.id as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getPopular = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const days = parseInt(req.query.days as string) || 30;
      const result = await this.analyticsService.getPopularProperties(limit, days);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getAgentStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.analyticsService.getAgentStats(req.params.id as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
