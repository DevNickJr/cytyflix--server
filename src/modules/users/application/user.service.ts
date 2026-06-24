import { User, UserProfile } from "@/modules/users/domain/user";
import { UserRepository, RolesEnum } from "@/modules/users/contracts/user.interfaces";
import { CreateUserDTO } from "@/modules/auth/contracts/auth.schemas";
import { UpdateProfileDTO, UpdateRoleDTO } from "@/modules/users/contracts/user.schemas";
import CustomError from "@/shared/utils/custom-error";

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
      currentProfile.id || crypto.randomUUID(),
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

  async getAgents(page: number, limit: number) {
    const result = await this.userRepo.findByRole(RolesEnum.AGENT, page, limit);
    return {
      ...result,
      data: result.data.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile || null,
        createdAt: user.createdAt,
      })),
    };
  }

  async getAgent(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new CustomError("Agent not found", 404);
    if (user.role !== RolesEnum.AGENT) throw new CustomError("User is not an agent", 404);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile || null,
      createdAt: user.createdAt,
    };
  }

  async updateRole(userId: string, dto: UpdateRoleDTO) {
    const admin = await this.userRepo.findById(userId);
    if (!admin) throw new Error("User not found");

    if (admin.role !== RolesEnum.ADMIN) throw new CustomError("You are not authorized to perform this actiion ", 401);

    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new Error("User does not exist");

    user.role = dto.role;

    return this.userRepo.update(user);
  }
}
