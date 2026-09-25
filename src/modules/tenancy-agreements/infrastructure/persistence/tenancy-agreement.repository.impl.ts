import { Repository } from 'typeorm';
import { TenancyAgreementOrmEntity } from './tenancy-agreement.orm-entity';
import { TenancyAgreementMapper } from './tenancy-agreement.mapper';
import { TenancyAgreement } from '../../domain/tenancy-agreement';
import {
  TenancyAgreementRepository,
  PaginatedResult,
} from '../../contracts/tenancy-agreement.interfaces';

export class TenancyAgreementRepositoryImpl implements TenancyAgreementRepository {
  constructor(private readonly repo: Repository<TenancyAgreementOrmEntity>) {}

  async create(agreement: TenancyAgreement): Promise<TenancyAgreement> {
    const entity = this.repo.create(
      TenancyAgreementMapper.toPersistence(agreement)
    );
    const saved = await this.repo.save(entity);
    return TenancyAgreementMapper.toDomain(saved);
  }

  async findById(id: string): Promise<TenancyAgreement | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: {
        landlord: { profile: true },
        tenant: { profile: true },
        property: true,
      },
    });
    return entity ? TenancyAgreementMapper.toDomain(entity) : null;
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<TenancyAgreement>> {
    const [entities, total] = await this.repo.findAndCount({
      where: [{ landlordId: userId }, { tenantId: userId }],
      relations: {
        landlord: { profile: true },
        tenant: { profile: true },
        property: true,
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: entities.map(TenancyAgreementMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async update(agreement: TenancyAgreement): Promise<TenancyAgreement> {
    await this.repo.update(
      agreement.id,
      TenancyAgreementMapper.toPersistence(agreement)
    );
    const updated = await this.repo.findOne({
      where: { id: agreement.id },
      relations: {
        landlord: { profile: true },
        tenant: { profile: true },
        property: true,
      },
    });
    return TenancyAgreementMapper.toDomain(updated!);
  }
}
