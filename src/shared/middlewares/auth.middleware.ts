import { Request, Response, NextFunction } from 'express';
import CustomError from '@/shared/utils/custom-error';
import { AccessTokenPayload } from '@/modules/auth/contracts/auth.interfaces';
import { RolesEnum } from '@/modules/users/contracts/user.interfaces';
import * as jwt from 'jsonwebtoken';
import env from '@/configs/env.config';
import { extractFromCookie, extractTokenFromHeader } from '../utils/auth';
import { AppDataSource } from '@/infrastructure/database/app-data-source';
import { UserOrmEntity } from '@/modules/users/infrastructure/persistence/user.orm-entity';
import { UserMapper } from '@/modules/users/infrastructure/persistence/user.mapper';

export const AuthGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractFromCookie(req) || extractTokenFromHeader(req);

    if (!token) throw new CustomError('You are Not Authenticated', 401);

    const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    if (!decoded) throw new CustomError('You are Not Authenticated', 401);

    const userRepo = AppDataSource.getRepository(UserOrmEntity);
    const entity = await userRepo.findOne({ where: { id: decoded.id } });

    if (!entity)
      throw new CustomError('Unauthorized access: User does not exist', 401);

    req.user = UserMapper.toDomain(entity);
    next();
  } catch (error) {
    next(error);
  }
};

export const OptionalAuthGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractFromCookie(req) || extractTokenFromHeader(req);
    if (!token) return next();

    const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    if (!decoded) return next();

    const userRepo = AppDataSource.getRepository(UserOrmEntity);
    const entity = await userRepo.findOne({ where: { id: decoded.id } });

    if (entity) {
      req.user = UserMapper.toDomain(entity);
    }

    next();
  } catch {
    next();
  }
};

export const RoleGuard =
  (allowedRoles: RolesEnum[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
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
