import { TenancyAgreement, AgreementStatus } from "../../domain/tenancy-agreement";
import { TenancyAgreementOrmEntity } from "./tenancy-agreement.orm-entity";

export class TenancyAgreementMapper {
  static toDomain(entity: TenancyAgreementOrmEntity): TenancyAgreement {
    return new TenancyAgreement(
      entity.id,
      entity.propertyId,
      entity.landlordId,
      entity.tenantId,
      entity.agreementContent,
      entity.landlordSignature,
      entity.tenantSignature,
      entity.landlordSignedAt,
      entity.tenantSignedAt,
      entity.status as AgreementStatus,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: TenancyAgreement): Partial<TenancyAgreementOrmEntity> {
    return {
      id: domain.id,
      propertyId: domain.propertyId,
      landlordId: domain.landlordId,
      tenantId: domain.tenantId,
      agreementContent: domain.agreementContent,
      landlordSignature: domain.landlordSignature,
      tenantSignature: domain.tenantSignature,
      landlordSignedAt: domain.landlordSignedAt,
      tenantSignedAt: domain.tenantSignedAt,
      status: domain.status,
    };
  }
}
