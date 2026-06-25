import { User } from "@/modules/users/domain/user";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import z from "zod";

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string, query: SearchByLocationQuery): Promise<PaginatedResult<User>>;
  update(user: User): Promise<User>;
}

export enum RolesEnum {
  RENT_SEEKER = "rent_seeker",
  PROPERTY_OWNER = "property_owner",
  AGENT = "agent",
  ADMIN = "admin",
}

export const SearchByLocationQuerySchema = z.object({
  query: z.object({
    city: z.string().optional(),
    lga: z.string().optional(),
    state: z.string().optional(),
    page: z.string({ error: 'page must be a number' })
      .refine(val => parseInt(val || '1'))
      .transform(val => parseInt(val || '1', 10)) // convert string → number
      .pipe(
        z
          .number({ error: 'page must be a number' })
          .int({ error: 'page must be an integer' })
          .positive({ error: 'page must be a positive number' })
      )
      .optional()
      .default(1),
    limit: z.string({ error: 'limit must be a number' })
      .refine(val => parseInt(val || '1'))
      .transform(val => parseInt(val || '1', 10)) // convert string → number
      .pipe(
        z
          .number({ error: 'limit must be a number' })
          .int({ error: 'limit must be an integer' })
          .positive({ error: 'limit must be a positive number' })
      )
      .optional()
      .default(1),
    sortBy: z.enum(["createdAt"]).default("createdAt").optional(),
    sortOrder: z.enum(["ASC", "DESC"]).default("DESC").optional(),
  })
});

export type SearchByLocationQuery = z.infer<typeof SearchByLocationQuerySchema>["query"];
