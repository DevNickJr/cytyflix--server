import { Request, Response, NextFunction } from 'express';
import CustomError from '@/shared/utils/custom-error';
import { AccessTokenPayload, RolesEnum } from '../interfaces';
import * as jwt from 'jsonwebtoken'
import env from '@/configs/env.config';
import { User } from '@/modules/users/domain/user';
import { extractFromCookie, extractTokenFromHeader } from '../utils/auth';

export const AuthGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractFromCookie(req) || extractTokenFromHeader(req);

    if (!token) throw new CustomError('You are Not Authenticated', 401);
    
    const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    if (!decoded) throw new CustomError('You are Not Authenticated', 401);
    
    // TODO: replace with getUser from repository
    const getUser = async (id: string): Promise<User>  => {
      return {
        id: id,
        email: 'email',
        role: RolesEnum.USER,
        password: '',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } 
    }
    const user = await getUser(decoded.id);

    if (!user)
      throw new CustomError('Unauthorized access: User does not exist', 401);

    req.user = user;
  } catch (error) {
    next(error);
  }
};

export const CoachGuard = [
  AuthGuard,
];

export const RoleGuard =
  (allowedRoles: RolesEnum[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new CustomError(
          'Unauthorized access: You are not authenticated',
          401
        );
      }
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        throw new CustomError(
          'Unauthorized access: You are not allowed to perform this action',
          403
        );
      }
    } catch (error) {
      next(error);
    }
  };
