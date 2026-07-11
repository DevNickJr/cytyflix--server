import { Repository, LessThan } from "typeorm";
import { RentPaymentRepository } from "../../contracts/rent-payment.interfaces";
import { RentPayment, RentPaymentStatus } from "../../domain/rent-payment";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { RentPaymentOrmEntity } from "./rent-payment.orm-entity";
import { RentPaymentMapper } from "./rent-payment.mapper";

export class RentPaymentRepositoryImpl implements RentPaymentRepository {
  constructor(
    private readonly ormRepo: Repository<RentPaymentOrmEntity>,
  ) {}

  async create(payment: RentPayment): Promise<RentPayment> {
    const entity = RentPaymentMapper.toPersistence(payment);
    const saved = await this.ormRepo.save(entity);
    return RentPaymentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<RentPayment | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: { tenant: { profile: true }, owner: { profile: true }, property: true },
    });
    if (!entity) return null;
    return RentPaymentMapper.toDomain(entity);
  }

  async findByPaymentReference(reference: string): Promise<RentPayment | null> {
    const entity = await this.ormRepo.findOne({ where: { paymentReference: reference } });
    if (!entity) return null;
    return RentPaymentMapper.toDomain(entity);
  }

  async findByTenantId(tenantId: string, page: number, limit: number): Promise<PaginatedResult<RentPayment>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { tenantId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { owner: { profile: true }, property: true },
    });

    return {
      data: entities.map(RentPaymentMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByOwnerId(ownerId: string, page: number, limit: number): Promise<PaginatedResult<RentPayment>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { ownerId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { tenant: { profile: true }, property: true },
    });

    return {
      data: entities.map(RentPaymentMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findExpiredPayments(): Promise<RentPayment[]> {
    const now = new Date();
    const entities = await this.ormRepo.find({
      where: {
        status: RentPaymentStatus.PAID,
        tenantConfirmed: false,
        expiresAt: LessThan(now),
      },
    });
    return entities.map(RentPaymentMapper.toDomain);
  }

  async update(payment: RentPayment): Promise<RentPayment> {
    const entity = RentPaymentMapper.toPersistence(payment);
    const updated = await this.ormRepo.save(entity);
    return RentPaymentMapper.toDomain(updated);
  }
}
