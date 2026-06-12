import { Request, Response, NextFunction } from "express";
import { SavedListingService } from "../application/saved-listing.service";

export class SavedListingController {
  constructor(private readonly savedListingService: SavedListingService) {}

  toggleSave = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.savedListingService.toggleSave(req.user!.id, req.body.propertyId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getMyListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.savedListingService.getSavedListings(req.user!.id, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  checkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.savedListingService.checkIfSaved(req.user!.id, req.params.propertyId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
