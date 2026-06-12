import { Request, Response, NextFunction } from "express";
import { PropertyService } from "../application/property.service";
import { SearchPropertyQuery, SearchPropertyQuerySchema } from "../contracts/property.schemas";
import { PaginationQueryDTO } from "@/shared/schemas";

export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const property = await this.propertyService.createProperty(req.user!.id, req.body);
      res.status(201).json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log({
        params: req.params,
        body:  req.body
      })
      const property = await this.propertyService.getProperty(req.params.id as string);
      res.json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  };

  getMyListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as PaginationQueryDTO;
      const result = await this.propertyService.getPropertiesByOwner({
        ownerId: req.user!.id,
        page: query.page,
        limit: query.limit
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log({
        params: req.params,
        body:  req.body
      })
      const property = await this.propertyService.updateProperty(req.params.id as string, req.user!.id, req.body);
      res.json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.propertyService.deleteProperty(req.params.id as string, req.user!.id);
      res.json({ success: true, message: "Property deleted" });
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as SearchPropertyQuery;
      const result = await this.propertyService.searchProperties(query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}
