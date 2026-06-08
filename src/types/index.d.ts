import { User } from "@/modules/users/domain/user";

// Extend the Request interface to include the user property when the middleware is used
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
