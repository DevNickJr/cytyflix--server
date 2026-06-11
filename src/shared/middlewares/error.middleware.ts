import { Request, Response, NextFunction, Application } from 'express';
import CustomError from '@/utils/CustomError';
import logger from '@/utils/logger';

export default function ErrorMiddleware(app: Application) {
  logger.info('Registering Error middlewares');

  // custom 404 && this will replace default express Not Found response
  app.use((req, res) => {
    res.status(404).send('Sorry, Resource Not Found!');
  });

  // custom error handler && this will replace default express error respons

  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: CustomError, req: Request, res: Response, next: NextFunction) => {
      logger.info('Error middleware');
      const status = err.status || 500;
      const message = err.message || err;
      console.log('error', `status: ${status}, message: ${message}`);
      console.log('error', err);
      res.status(status).json({ success: false, message });
    }
  );
}
