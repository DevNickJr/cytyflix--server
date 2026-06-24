import { Repository } from "typeorm";
import { AgentVerificationRepository } from "../../contracts/agent-verification.interfaces";
import { AgentVerification } from "../../domain/agent-verification";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";
import { AgentVerificationOrmEntity } from "./agent-verification.orm-entity";
import { AgentVerificationMapper } from "./agent-verification.mapper";

export class AgentVerificationRepositoryImpl implements AgentVerificationRepository {
  constructor(
    private readonly ormRepo: Repository<AgentVerificationOrmEntity>,
  ) {}

  async create(verification: AgentVerification): Promise<AgentVerification> {
    const entity = AgentVerificationMapper.toPersistence(verification);
    const saved = await this.ormRepo.save(entity);
    return AgentVerificationMapper.toDomain(saved);
  }

  async findById(id: string): Promise<AgentVerification | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;
    return AgentVerificationMapper.toDomain(entity);
  }

  async findByUserId(userId: string): Promise<AgentVerification | null> {
    const entity = await this.ormRepo.findOne({ where: { userId } });
    if (!entity) return null;
    return AgentVerificationMapper.toDomain(entity);
  }

  async findAll(
    status: string | undefined,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<AgentVerification>> {
    const where: Record<string, string> = {};
    if (status) where.status = status;

    const [entities, total] = await this.ormRepo.findAndCount({
      where,
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: { user: { profile: true } },
    });

    return {
      data: entities.map(AgentVerificationMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(verification: AgentVerification): Promise<AgentVerification> {
    const entity = AgentVerificationMapper.toPersistence(verification);
    const updated = await this.ormRepo.save(entity);
    return AgentVerificationMapper.toDomain(updated);
  }
}
