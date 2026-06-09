import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "@/modules/users/domain/user";
import { UserRepository } from "@/modules/users/domain/user.repository";
import { CreateUserDTO } from "./schemas/auth.schema";

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

  async login(dto: CreateUserDTO) {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    
    if (!passwordMatches) {
      throw new Error("Invalid credentials");
    }

    return {
      userId: user.id,
      email: user.email,
      // return token/session (next step)
    };
  }
}