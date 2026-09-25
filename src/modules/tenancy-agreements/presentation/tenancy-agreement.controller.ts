import { Request, Response, NextFunction } from 'express';
import { TenancyAgreementService } from '../application/tenancy-agreement.service';

export class TenancyAgreementController {
  constructor(private readonly service: TenancyAgreementService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  getMyAgreements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.service.getMyAgreements(
        req.user!.id,
        page,
        limit
      );
      res.json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAgreement(
        req.params.id as string,
        req.user!.id
      );
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  signAsLandlord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.signAsLandlord(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  signAsTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.signAsTenant(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  downloadPDF = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pdfBuffer = await this.service.downloadPDF(
        req.params.id as string,
        req.user!.id
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="tenancy-agreement-${req.params.id as string}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      });
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}
