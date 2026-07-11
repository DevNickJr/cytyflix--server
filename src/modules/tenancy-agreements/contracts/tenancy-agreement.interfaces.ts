import { TenancyAgreement } from "../domain/tenancy-agreement";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TenancyAgreementRepository {
  create(agreement: TenancyAgreement): Promise<TenancyAgreement>;
  findById(id: string): Promise<TenancyAgreement | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<PaginatedResult<TenancyAgreement>>;
  update(agreement: TenancyAgreement): Promise<TenancyAgreement>;
}
