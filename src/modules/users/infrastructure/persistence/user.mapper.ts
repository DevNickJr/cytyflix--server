import { User } from "../../domain/user";
import { UserOrmEntity } from "./user.orm-entity";

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.password,
      entity.name,
      entity.createdAt
    );
  }

  static toPersistence(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();

    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.name = user.name;
    entity.createdAt = user.createdAt;

    return entity;
  }
}