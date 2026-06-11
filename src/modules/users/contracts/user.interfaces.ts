import { User } from "@/modules/users/domain/user";

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<User>;
}

export enum RolesEnum {
  RENT_SEEKER = "rent_seeker",
  PROPERTY_OWNER = "property_owner",
  AGENT = "agent",
  ADMIN = "admin",
}