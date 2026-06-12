import { Request, Response, NextFunction, Application } from 'express';
import CustomError from '@/shared/utils/custom-error';
import logger from '@/shared/utils/logger';

export default function ErrorMiddleware(app: Application) {
  logger.info('Registering Error middlewares');

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Resource Not Found' });
  });

  app.use(
    (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
      logger.error(`${err.status || 500} - ${err.message}`);
      const status = err.status || 500;
      const message = err.message || 'Internal Server Error';
      res.status(status).json({ success: false, message });
    }
  );
}
