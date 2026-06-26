import { User, UserProfile } from "@/modules/users/domain/user";
import { UserRepository, RolesEnum, SearchByLocationQuery } from "@/modules/users/contracts/user.interfaces";
import { PropertyRepository } from "@/modules/properties/contracts/property.interfaces";
import { CreateUserDTO } from "@/modules/auth/contracts/auth.schemas";
import { UpdateProfileDTO, UpdateRoleDTO } from "@/modules/users/contracts/user.schemas";
import { generateSlug, validateSlug } from "@/shared/utils/slugify";
import CustomError from "@/shared/utils/custom-error";

export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly propertyRepo: PropertyRepository,
  ) {}

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

  async getUserByEmail(email: string) {
    return this.userRepo.findByEmail(email);
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

    const firstName = dto.firstName ?? currentProfile.firstName;
    const lastName = dto.lastName ?? currentProfile.lastName;

    // Auto-generate slug when name is set and no slug exists yet
    let slug = currentProfile.slug;
    if (!slug && firstName && lastName) {
      slug = await this.generateUniqueSlug(firstName, lastName);
    }

    user.profile = new UserProfile(
      currentProfile.id || crypto.randomUUID(),
      firstName,
      lastName,
      dto.phoneNumber ?? currentProfile.phoneNumber,
      dto.bio ?? currentProfile.bio,
      dto.preferredLocation ?? currentProfile.preferredLocation,
      dto.budgetMin ?? currentProfile.budgetMin,
      dto.budgetMax ?? currentProfile.budgetMax,
      dto.profileImage ?? currentProfile.profileImage,
      dto.operatingStates ?? currentProfile.operatingStates,
      dto.operatingLgas ?? currentProfile.operatingLgas,
      dto.operatingCities ?? currentProfile.operatingCities,
      slug,
    );

    return this.userRepo.update(user);
  }

  private async generateUniqueSlug(firstName: string, lastName: string): Promise<string> {
    const baseSlug = generateSlug(firstName, lastName);
    if (!baseSlug) return "";

    let slug = baseSlug;
    let counter = 1;
    while (await this.userRepo.slugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async updateSlug(userId: string, newSlug: string) {
    if (!validateSlug(newSlug)) {
      throw new CustomError("Invalid slug format. Must be 3-50 characters, lowercase alphanumeric with hyphens.", 400);
    }

    const existing = await this.userRepo.findBySlug(newSlug);
    if (existing && existing.id !== userId) {
      throw new CustomError("This slug is already taken", 409);
    }

    const user = await this.userRepo.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    const currentProfile = user.profile || new UserProfile("", "", "", "");
    user.profile = new UserProfile(
      currentProfile.id || crypto.randomUUID(),
      currentProfile.firstName,
      currentProfile.lastName,
      currentProfile.phoneNumber,
      currentProfile.bio,
      currentProfile.preferredLocation,
      currentProfile.budgetMin,
      currentProfile.budgetMax,
      currentProfile.profileImage,
      currentProfile.operatingStates,
      currentProfile.operatingLgas,
      currentProfile.operatingCities,
      newSlug,
    );

    return this.userRepo.update(user);
  }

  async getAgentBySlug(slug: string) {
    const user = await this.userRepo.findBySlug(slug);
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

  async getAgents(query: SearchByLocationQuery) {
    const result = await this.userRepo.findByRole(RolesEnum.AGENT, query);
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

  async getAgentProperties(agentId: string, query: SearchByLocationQuery) {
    const user = await this.userRepo.findById(agentId);
    if (!user) throw new CustomError("Agent not found", 404);
    if (user.role !== RolesEnum.AGENT) throw new CustomError("User is not an agent", 404);

    return this.propertyRepo.findByOwnerId(agentId, query);
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
