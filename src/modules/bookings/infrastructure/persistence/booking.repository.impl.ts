import { Repository, MoreThan } from "typeorm";
import { BookingRepository } from "../../contracts/booking.interfaces";
import { Booking, BookingStatus, PaymentStatus } from "../../domain/booking";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { BookingOrmEntity } from "./booking.orm-entity";
import { BookingMapper } from "./booking.mapper";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(
    private readonly ormRepo: Repository<BookingOrmEntity>,
  ) {}

  async create(booking: Booking): Promise<Booking> {
    const entity = BookingMapper.toPersistence(booking);
    const saved = await this.ormRepo.save(entity);
    return BookingMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Booking | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: { client: { profile: true }, agent: { profile: true }, property: true },
    });
    if (!entity) return null;
    return BookingMapper.toDomain(entity);
  }

  async findByClientId(clientId: string, page: number, limit: number): Promise<PaginatedResult<Booking>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { clientId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { agent: { profile: true }, property: true },
    });

    return {
      data: entities.map(BookingMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByAgentId(agentId: string, page: number, limit: number): Promise<PaginatedResult<Booking>> {
    const [entities, total] = await this.ormRepo.findAndCount({
      where: { agentId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { client: { profile: true }, property: true },
    });

    return {
      data: entities.map(BookingMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByPaymentReference(reference: string): Promise<Booking | null> {
    const entity = await this.ormRepo.findOne({ where: { paymentReference: reference } });
    if (!entity) return null;
    return BookingMapper.toDomain(entity);
  }

  async findExpiredBookings(): Promise<Booking[]> {
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const entities = await this.ormRepo.find({
      where: {
        paymentStatus: PaymentStatus.PAID,
        bookingStatus: BookingStatus.CONFIRMED,
        scheduledDate: MoreThan(fortyEightHoursAgo),
      },
    });

    return entities.map(BookingMapper.toDomain);
  }

  async update(booking: Booking): Promise<Booking> {
    const entity = BookingMapper.toPersistence(booking);
    const updated = await this.ormRepo.save(entity);
    return BookingMapper.toDomain(updated);
  }
}
