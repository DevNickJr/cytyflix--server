import { Repository } from "typeorm";
import { PropertyRepository, PaginatedResult, SearchFilters } from "@/modules/properties/contracts/property.interfaces";
import { Property } from "@/modules/properties/domain/property";
import { PropertyOrmEntity } from "./property.orm-entity";
import { PropertyMapper } from "./property.mapper";

export class PropertyRepositoryImpl implements PropertyRepository {
  constructor(
    private readonly ormRepo: Repository<PropertyOrmEntity>
  ) {}

  async create(property: Property): Promise<Property> {
    const entity = PropertyMapper.toPersistence(property);
    const saved = await this.ormRepo.save(entity);
    return PropertyMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Property | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;
    return PropertyMapper.toDomain(entity);
  }

  async findByOwnerId(ownerId: string, page: number, limit: number): Promise<PaginatedResult<Property>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { ownerId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map(PropertyMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(property: Property): Promise<Property> {
    const entity = PropertyMapper.toPersistence(property);
    const updated = await this.ormRepo.save(entity);
    return PropertyMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  async search(filters: SearchFilters): Promise<PaginatedResult<Property>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "DESC";

    const qb = this.ormRepo.createQueryBuilder("property");

    if (filters.city) {
      qb.andWhere("LOWER(property.city) = LOWER(:city)", { city: filters.city });
    }

    if (filters.state) {
      qb.andWhere("LOWER(property.state) = LOWER(:state)", { state: filters.state });
    }

    if (filters.propertyType) {
      qb.andWhere("property.propertyType = :propertyType", { propertyType: filters.propertyType });
    }

    if (filters.listingType) {
      qb.andWhere("property.listingType = :listingType", { listingType: filters.listingType });
    }

    if (filters.minPrice !== undefined) {
      qb.andWhere("property.price >= :minPrice", { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      qb.andWhere("property.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }

    if (filters.bedrooms !== undefined) {
      qb.andWhere("property.bedrooms >= :bedrooms", { bedrooms: filters.bedrooms });
    }

    if (filters.bathrooms !== undefined) {
      qb.andWhere("property.bathrooms >= :bathrooms", { bathrooms: filters.bathrooms });
    }

    if (filters.isAvailable !== undefined) {
      qb.andWhere("property.isAvailable = :isAvailable", { isAvailable: filters.isAvailable });
    }

    if (filters.amenities && filters.amenities.length > 0) {
      // PostgreSQL JSONB containment: amenities column contains all requested amenities
      qb.andWhere("property.amenities @> :amenities", {
        amenities: JSON.stringify(filters.amenities),
      });
    }

    qb.orderBy(`property.${sortBy}`, sortOrder);
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      data: entities.map(PropertyMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
