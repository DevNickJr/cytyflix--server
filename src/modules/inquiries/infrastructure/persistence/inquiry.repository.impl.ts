import { Repository } from "typeorm";
import { InquiryRepository } from "@/modules/inquiries/contracts/inquiry.interfaces";
import { Inquiry } from "@/modules/inquiries/domain/inquiry";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { InquiryOrmEntity } from "./inquiry.orm-entity";
import { InquiryMapper } from "./inquiry.mapper";

export class InquiryRepositoryImpl implements InquiryRepository {
  constructor(
    private readonly ormRepo: Repository<InquiryOrmEntity>
  ) {}

  async create(inquiry: Inquiry): Promise<Inquiry> {
    const entity = InquiryMapper.toPersistence(inquiry);
    const saved = await this.ormRepo.save(entity);
    return InquiryMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Inquiry | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;
    return InquiryMapper.toDomain(entity);
  }

  async findBySenderId(senderId: string, page: number, limit: number): Promise<PaginatedResult<Inquiry>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { senderId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map(InquiryMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByRecipientId(recipientId: string, page: number, limit: number): Promise<PaginatedResult<Inquiry>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { recipientId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map(InquiryMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByPropertyId(propertyId: string, page: number, limit: number): Promise<PaginatedResult<Inquiry>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { propertyId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map(InquiryMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(inquiry: Inquiry): Promise<Inquiry> {
    const entity = InquiryMapper.toPersistence(inquiry);
    const updated = await this.ormRepo.save(entity);
    return InquiryMapper.toDomain(updated);
  }
}
