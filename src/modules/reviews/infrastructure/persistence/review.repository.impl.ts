import { Repository } from "typeorm";
import { ReviewRepository } from "../../contracts/review.interfaces";
import { Review } from "../../domain/review";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { ReviewOrmEntity } from "./review.orm-entity";
import { ReviewMapper } from "./review.mapper";

export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(
    private readonly ormRepo: Repository<ReviewOrmEntity>,
  ) {}

  async create(review: Review): Promise<Review> {
    const entity = ReviewMapper.toPersistence(review);
    const saved = await this.ormRepo.save(entity);
    const loaded = await this.ormRepo.findOne({
      where: { id: saved.id },
      relations: { user: { profile: true } },
    });
    return ReviewMapper.toDomain(loaded || saved);
  }

  async findById(id: string): Promise<Review | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: { user: { profile: true } },
    });
    if (!entity) return null;
    return ReviewMapper.toDomain(entity);
  }

  async findByPropertyId(propertyId: string, page: number, limit: number): Promise<PaginatedResult<Review>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { propertyId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { user: { profile: true } },
    });

    return {
      data: entities.map(ReviewMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserAndProperty(userId: string, propertyId: string): Promise<Review | null> {
    const entity = await this.ormRepo.findOne({
      where: { userId, propertyId },
      relations: { user: { profile: true } },
    });
    if (!entity) return null;
    return ReviewMapper.toDomain(entity);
  }

  async getAverageRating(propertyId: string): Promise<{ average: number; count: number }> {
    const result = await this.ormRepo
      .createQueryBuilder("review")
      .select("AVG(review.rating)", "average")
      .addSelect("COUNT(review.id)", "count")
      .where("review.propertyId = :propertyId", { propertyId })
      .getRawOne();

    return {
      average: result?.average ? parseFloat(result.average) : 0,
      count: result?.count ? parseInt(result.count) : 0,
    };
  }

  async update(review: Review): Promise<Review> {
    const entity = ReviewMapper.toPersistence(review);
    const updated = await this.ormRepo.save(entity);
    const loaded = await this.ormRepo.findOne({
      where: { id: updated.id },
      relations: { user: { profile: true } },
    });
    return ReviewMapper.toDomain(loaded || updated);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
