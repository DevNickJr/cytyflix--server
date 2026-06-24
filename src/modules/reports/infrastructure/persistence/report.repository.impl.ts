import { Repository } from "typeorm";
import { ReportRepository } from "../../contracts/report.interfaces";
import { Report } from "../../domain/report";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { ReportOrmEntity } from "./report.orm-entity";
import { ReportMapper } from "./report.mapper";

export class ReportRepositoryImpl implements ReportRepository {
  constructor(
    private readonly ormRepo: Repository<ReportOrmEntity>,
  ) {}

  async create(report: Report): Promise<Report> {
    const entity = ReportMapper.toPersistence(report);
    const saved = await this.ormRepo.save(entity);
    return ReportMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Report | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: { user: { profile: true }, property: true },
    });
    if (!entity) return null;
    return ReportMapper.toDomain(entity);
  }

  async findAll(status: string | undefined, page: number, limit: number): Promise<PaginatedResult<Report>> {
    const where: Record<string, string> = {};
    if (status) where.status = status;

    const [entities, total] = await this.ormRepo.findAndCount({
      where,
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { user: { profile: true }, property: true },
    });

    return {
      data: entities.map(ReportMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(report: Report): Promise<Report> {
    const entity = ReportMapper.toPersistence(report);
    const updated = await this.ormRepo.save(entity);
    return ReportMapper.toDomain(updated);
  }
}
