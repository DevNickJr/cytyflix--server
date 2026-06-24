import { Review } from "../../domain/review";
import { ReviewOrmEntity } from "./review.orm-entity";

export class ReviewMapper {
  static toDomain(entity: ReviewOrmEntity): Review {
    return new Review(
      entity.id,
      entity.userId,
      entity.propertyId,
      entity.rating,
      entity.comment,
      entity.user?.profile
        ? `${entity.user.profile.firstName || ""} ${entity.user.profile.lastName || ""}`.trim()
        : undefined,
      entity.user?.profile?.profileImage,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(review: Review): ReviewOrmEntity {
    const entity = new ReviewOrmEntity();
    entity.id = review.id;
    entity.userId = review.userId;
    entity.propertyId = review.propertyId;
    entity.rating = review.rating;
    entity.comment = review.comment;
    entity.createdAt = review.createdAt;
    entity.updatedAt = review.updatedAt;
    return entity;
  }
}
