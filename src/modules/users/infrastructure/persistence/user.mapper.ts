import { RolesEnum } from "@/modules/users/contracts/user.interfaces";
import { User, UserProfile } from "../../domain/user";
import { UserOrmEntity } from "./user.orm-entity";
import { UserProfileOrmEntity } from "./user-profile.orm-entity";

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    let profile: UserProfile | undefined;

    if (entity.profile) {
      profile = new UserProfile(
        entity.profile.id,
        entity.profile.firstName || "",
        entity.profile.lastName || "",
        entity.profile.phoneNumber || "",
        entity.profile.bio,
        entity.profile.preferredLocation,
        entity.profile.budgetMin ? Number(entity.profile.budgetMin) : undefined,
        entity.profile.budgetMax ? Number(entity.profile.budgetMax) : undefined,
        entity.profile.profileImage,
      );
    }

    return new User(
      entity.id,
      entity.email,
      entity.password,
      entity.role as RolesEnum,
      entity.isVerified,
      profile,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();

    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.role = user.role;
    entity.isVerified = user.isVerified;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;

    if (user.profile) {
      const profileEntity = new UserProfileOrmEntity();
      profileEntity.id = user.profile.id;
      profileEntity.firstName = user.profile.firstName;
      profileEntity.lastName = user.profile.lastName;
      profileEntity.phoneNumber = user.profile.phoneNumber;
      profileEntity.bio = user.profile.bio;
      profileEntity.preferredLocation = user.profile.preferredLocation;
      profileEntity.budgetMin = user.profile.budgetMin;
      profileEntity.budgetMax = user.profile.budgetMax;
      profileEntity.profileImage = user.profile.profileImage;
      profileEntity.userId = user.id;
      entity.profile = profileEntity;
    }

    return entity;
  }
}
