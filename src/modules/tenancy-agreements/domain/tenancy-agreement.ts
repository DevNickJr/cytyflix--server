export enum AgreementStatus {
  DRAFT = 'draft',
  PENDING_TENANT = 'pending_tenant',
  PENDING_LANDLORD = 'pending_landlord',
  SIGNED = 'signed',
  EXPIRED = 'expired',
}

export class TenancyAgreement {
  constructor(
    public id: string,
    public propertyId: string,
    public landlordId: string,
    public tenantId: string,
    public agreementContent: string,
    public landlordSignature: string | null,
    public tenantSignature: string | null,
    public landlordSignedAt: Date | null,
    public tenantSignedAt: Date | null,
    public status: AgreementStatus,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
