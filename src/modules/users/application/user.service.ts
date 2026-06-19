import { User, UserProfile } from "@/modules/users/domain/user";
import { UserRepository } from "@/modules/users/contracts/user.interfaces";
import { CreateUserDTO } from "@/modules/auth/contracts/auth.schemas";
import { UpdateProfileDTO } from "@/modules/users/contracts/user.schemas";

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDTO) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new Error("User already exists");

    const user = new User(
      crypto.randomUUID(),
      dto.email,
      dto.password,
    );

    return this.userRepo.create(user);
  }

  async getUser(id: string) {
    return this.userRepo.findById(id);
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profile: user.profile || null,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDTO) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const currentProfile = user.profile || new UserProfile("", "", "", "");

    user.profile = new UserProfile(
      currentProfile.id ?? crypto.randomUUID(),
      dto.firstName ?? currentProfile.firstName,
      dto.lastName ?? currentProfile.lastName,
      dto.phoneNumber ?? currentProfile.phoneNumber,
      dto.bio ?? currentProfile.bio,
      dto.preferredLocation ?? currentProfile.preferredLocation,
      dto.budgetMin ?? currentProfile.budgetMin,
      dto.budgetMax ?? currentProfile.budgetMax,
      dto.profileImage ?? currentProfile.profileImage,
    );

    return this.userRepo.update(user);
  }
}
