import { Repository } from "typeorm";
import { SavedListingRepository } from "@/modules/saved-listings/contracts/saved-listing.interfaces";
import { SavedListing } from "@/modules/saved-listings/domain/saved-listing";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { SavedListingOrmEntity } from "./saved-listing.orm-entity";
import { SavedListingMapper } from "./saved-listing.mapper";

export class SavedListingRepositoryImpl implements SavedListingRepository {
  constructor(
    private readonly ormRepo: Repository<SavedListingOrmEntity>
  ) {}

  async save(savedListing: SavedListing): Promise<SavedListing> {
    const entity = SavedListingMapper.toPersistence(savedListing);
    const saved = await this.ormRepo.save(entity);
    return SavedListingMapper.toDomain(saved);
  }

  async delete(userId: string, propertyId: string): Promise<void> {
    await this.ormRepo.delete({ userId, propertyId });
  }

  async findByUserAndProperty(userId: string, propertyId: string): Promise<SavedListing | null> {
    const entity = await this.ormRepo.findOne({ where: { userId, propertyId } });
    if (!entity) return null;
    return SavedListingMapper.toDomain(entity);
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<PaginatedResult<SavedListing>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { property: true },
    });

    return {
      data: entities.map(SavedListingMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
