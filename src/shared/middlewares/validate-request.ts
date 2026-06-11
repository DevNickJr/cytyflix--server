import logger from '@/shared/utils/logger';
import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

const validateRequest =
  (schemas: ZodObject[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('validation started');
      // console.log(req.body);
      let query = {};
      let params = {};
      let body = {};

      schemas?.map(schema => {
        const validObj = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        // console.log({ validObj });
        if (validObj.body) {
          body = {
            ...body,
            ...validObj.body,
          };
          // Object.assign(req.body, validObj.body);
        }
        if (validObj.query) {
          query = {
            ...query,
            ...validObj.query,
          };
        }
        if (validObj.params) {
          params = {
            ...params,
            ...validObj.params,
          };
        }
        // if (validObj.query) req.query = validObj.query as ParsedUrlQuery;
        // if (validObj.params) req.params = validObj.params as ParamsDictionary;
        // if (validObj.query) Object.assign(req.query, validObj.query);
        // if (validObj.params) Object.assign(req.params, validObj.params);
      });

      req.body = body; // remove all fields not validated
      req.query = query; // remove all fields not validated
      req.params = params; // remove all fields not validated

      logger.info('validation complete');
      console.log(req.query);

      next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // res.status(400).json({
      //   success: false,
      //   message:
      //       e?.errors && e.errors.length > 0
      //         ? e.errors[0]?.message
      //         : e?.message?.[0]?.message || 'Invalid fields',
      //   errors: e,
      // });
      console.log(e);

      const firstIssue = e.issues?.[0];
      logger.error('validation failed -');

      res.status(400).json({
        success: false,
        message: firstIssue?.message || 'Validation failed',
        errors: e.issues || e,
      });
    }
  };

export default validateRequest;
