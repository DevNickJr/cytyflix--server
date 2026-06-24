import { User } from "@/modules/users/domain/user";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string, page: number, limit: number): Promise<PaginatedResult<User>>;
  update(user: User): Promise<User>;
}

export enum RolesEnum {
  RENT_SEEKER = "rent_seeker",
  PROPERTY_OWNER = "property_owner",
  AGENT = "agent",
  ADMIN = "admin",
}