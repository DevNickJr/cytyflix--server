import { In, Raw, Repository } from "typeorm";
import { SearchByLocationQuery, UserRepository } from "@/modules/users/contracts/user.interfaces";
import { User } from "@/modules/users/domain/user";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { UserOrmEntity } from "./user.orm-entity";
import { UserMapper } from "./user.mapper";

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly ormRepo: Repository<UserOrmEntity>
  ) {}

  async create(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const saved = await this.ormRepo.save(entity);
    return UserMapper.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: {
        profile: true
      }
    });
    if (!entity) return null;

    console.log({
      entity
    })

    return UserMapper.toDomain(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    if (!entity) return null;

    return UserMapper.toDomain(entity);
  }

  async findByRole(role: string, query: SearchByLocationQuery): Promise<PaginatedResult<User>> {
    console.log({
      query
    })
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { 
        role,
        profile: {
          ...(query.state ? { operatingStates: Raw((alias) => `:state = ANY(${alias})`, { state: query.state }) } : {}),
          ...(query.city ? { operatingCities: Raw((alias) => `:city = ANY(${alias})`, { city: query.city }) } : {}),
          ...(query.lga ? { operatingLgas: Raw((alias) => `:lga = ANY(${alias})`, { lga: query.lga }) } : {}),
          
        }
        // profile: {
        //   ...(query.lga ? { operatingLgas: In([query.lga]) } : {}),
        //   ...(query.city ? { operatingCities: In([query.city]) } : {}),
        // }
      },
      order: { createdAt: query.sortOrder === "ASC" ? "ASC" : "DESC" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      relations: { profile: true },
    });

    return {
      data: entities.map(UserMapper.toDomain),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async update(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const updated = await this.ormRepo.save(entity);

    return UserMapper.toDomain(updated);
  }
}