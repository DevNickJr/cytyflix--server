import { User } from "@/modules/users/domain/user";
import { UserRepository } from "@/modules/users/contracts/user.interfaces";
import { CreateUserDTO } from "@/modules/auth/contracts/auth.schemas";

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

//   async updateUser(id: string, dto: UpdateUserDTO) {
//     const user = await this.userRepo.findById(id);
//     if (!user) throw new Error("User not found");

//     user.updateProfile(dto.name);

//     return this.userRepo.update(user);
//   }
}