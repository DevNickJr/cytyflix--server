import { Repository } from "typeorm";
import { UserRepository } from "@/modules/users/domain/user.repository";
import { User } from "@/modules/users/domain/user";
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
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;

    return UserMapper.toDomain(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    if (!entity) return null;

    return UserMapper.toDomain(entity);
  }

  async update(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const updated = await this.ormRepo.save(entity);

    return UserMapper.toDomain(updated);
  }
}