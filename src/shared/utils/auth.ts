import * as jwt from 'jsonwebtoken';
import env from "@/configs/env.config";
import { Request } from 'express';
import { AccessTokenPayload } from '@/modules/auth/contracts/auth.interfaces';

export const signJWT = ({
    user,
    rememberMe
}: {
  user: AccessTokenPayload,
  rememberMe?: boolean,
}) => {
  const accessOptions = {
    expiresIn: env.JWT_EXPIRATION || (12 * 60 * 60 * 1000), // half day by default
    audience: user.id,
  };
  const refreshOptions = {
    expiresIn: (rememberMe ? 3 : 0.25) * (30 * 24 * 60 * 60 * 1000), // remember me ? 3 months : 1 week
    audience: user.id,
  };
  return {
    access: jwt.sign(user, env.JWT_SECRET, accessOptions),
    refresh: jwt.sign(user, env.JWT_SECRET, refreshOptions),
  }
};

export const verifyJWT
 = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
};


export const extractTokenFromHeader = (
  request: Request
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') || [];
  return type === 'Bearer' ? token : undefined;
};

export const extractFromCookie = (req: Request): string | null => {
  let token: string | null =  null;
  if (req && req.cookies) {
    token = req.cookies['Authentication'];
  }
  return token;
};
