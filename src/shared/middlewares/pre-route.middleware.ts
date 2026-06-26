import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import { corsOptions } from '@/configs/cors.config';
import logger from '@/shared/utils/logger';
import { rateLimit } from 'express-rate-limit';

const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 300, // each IP can make up to 300 requests per `windowsMs` (5 minutes) - especially because of webhooks
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  handler: (req, res) => {
    logger.warn('Global Rate limit exceeded', {
      ip: req.ip,
      userId: req.user?.id?.toString(),
      path: req.originalUrl,
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests - Global limit exceeded',
    });
  },
});

export default function preRouteMiddleware(app: Express) {
  logger.info('Registering Preroute middlewares');
  app.use(cors(corsOptions));

  // Handle preflight requests explicitly
  app.options(/.*/, (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, tempauth, x-client-type, Cache-Control, cache-control, pragma'
    );
    res.setHeader('Access-Control-Max-Age', '300');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200); // Respond to preflight requests
  });
  app.use(globalLimiter); // limit requests to 200 per 5 minutes
  app.use(morgan('dev')); // logs requests to the console
  app.use(compression()); // compresses responses
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false })); // parses form submissions

  // extends the requestAnimationFrame.query object with a setter
  app.use((req, _res, next) => {
    Object.defineProperty(req, 'query', {
      ...Object.getOwnPropertyDescriptor(req, 'query'),
      value: req.query,
      writable: true,
    });
    next();
  });

  // Middleware to conditionally apply JSON parsing
  app.use(express.json({
        verify: (req, res, buf) => {
          (req as any).rawBody = buf.toString('utf8');
        },
      }));

  app.use(helmet()); // additional security layer by auto setting some important headers
  app.disable('x-powered-by'); // remove powered by express header for security purposes
}
