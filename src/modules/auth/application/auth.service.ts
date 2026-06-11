import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "@/modules/users/domain/user";
import { UserRepository } from "@/modules/users/domain/user.repository";
import { CreateUserDTO, LoginUserDTO } from "./schemas/auth.schema";
import { RolesEnum } from "@/shared/interfaces";
import logger from "@/shared/utils/logger";
import CustomError from "@/shared/utils/custom-error";
import { signJWT, verifyJWT } from "@/shared/utils/auth";

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(dto: CreateUserDTO) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User(
      crypto.randomUUID(),
      dto.email,
      hashedPassword 
    );

    return this.userRepo.create(user);
  }

  async login(dto: LoginUserDTO) {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    
    if (!passwordMatches) {
      throw new Error("Invalid credentials");
    }

    if (!user.isVerified) 
      throw new Error("Account not verified");

  if (!Object.values(RolesEnum).includes(user.role)) {
    logger.error(`Malicious user detected. id: ${user.id}`);
    throw new CustomError('User is Unauthorized', 401);
  }

  const { access, refresh } = signJWT({
    user: {
      id: user.id.toString(),
      role: user.role,
      email: user.email,
    },
    rememberMe: dto.rememberMe
  });

    return {
      userId: user.id,
      email: user.email,
      accessToken: access,
      refeshToken: refresh      
    };
  }

  async refreshToken ({
    refreshToken,
  }: {
    refreshToken: string;
  }) {
    const decoded = verifyJWT(refreshToken);
    const user = await this.userRepo.findById(decoded.id);

    if (!user)
      throw new CustomError('Unauthorized access: User does not exist', 401);

    if (!user.isVerified) throw new CustomError('User not verified');
    const { access, refresh } = signJWT({
      user: {
        id: user.id.toString(),
        role: user.role,
        email: user.email,
      },
    });

    return {
      accessToken: access,
      refreshToken: refresh,
    };
  };
}