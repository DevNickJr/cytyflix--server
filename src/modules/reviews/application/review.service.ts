import crypto from "crypto";
import { Review } from "../domain/review";
import { ReviewRepository } from "../contracts/review.interfaces";
import { CreateReviewDTO, UpdateReviewDTO } from "../contracts/review.schemas";
import { PropertyRepository } from "@/modules/properties/contracts/property.interfaces";
import CustomError from "@/shared/utils/custom-error";
import { RolesEnum } from "@/modules/users/contracts/user.interfaces";

export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly propertyRepo: PropertyRepository,
  ) {}

  async create(userId: string, propertyId: string, dto: CreateReviewDTO) {
    const property = await this.propertyRepo.findById(propertyId);
    if (!property) throw new CustomError("Property not found", 404);

    if (property.ownerId === userId) {
      throw new CustomError("You cannot review your own property", 400);
    }

    const existing = await this.reviewRepo.findByUserAndProperty(userId, propertyId);
    if (existing) {
      throw new CustomError("You have already reviewed this property", 400);
    }

    const review = new Review(
      crypto.randomUUID(),
      userId,
      propertyId,
      dto.rating,
      dto.comment,
    );

    return this.reviewRepo.create(review);
  }

  async getByProperty(propertyId: string, page: number, limit: number) {
    return this.reviewRepo.findByPropertyId(propertyId, page, limit);
  }

  async getSummary(propertyId: string) {
    return this.reviewRepo.getAverageRating(propertyId);
  }

  async update(reviewId: string, userId: string, dto: UpdateReviewDTO) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new CustomError("Review not found", 404);
    if (review.userId !== userId) throw new CustomError("You can only edit your own reviews", 403);

    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.comment !== undefined) review.comment = dto.comment;

    return this.reviewRepo.update(review);
  }

  async delete(reviewId: string, userId: string, userRole: RolesEnum) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new CustomError("Review not found", 404);

    if (review.userId !== userId && userRole !== RolesEnum.ADMIN) {
      throw new CustomError("You can only delete your own reviews", 403);
    }

    await this.reviewRepo.delete(reviewId);
  }
}
