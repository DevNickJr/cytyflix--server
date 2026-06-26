export {}; 
import { User } from "@/modules/users/domain/user";
import * as express from 'express';
// Extend the Request interface to include the user property when the middleware is used
declare global {
  namespace Express {
    export interface Request {
      user?: User;
      rawBody?: string; // Add rawBody property to the Request interface
    }
    export interface IncomingMessage {
      rawBody?: string; // Add rawBody property to the Request interface
    }
  }
}
