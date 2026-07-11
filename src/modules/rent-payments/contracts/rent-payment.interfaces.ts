import { RentPayment } from "../domain/rent-payment";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface RentPaymentRepository {
  create(payment: RentPayment): Promise<RentPayment>;
  findById(id: string): Promise<RentPayment | null>;
  findByPaymentReference(reference: string): Promise<RentPayment | null>;
  findByTenantId(tenantId: string, page: number, limit: number): Promise<PaginatedResult<RentPayment>>;
  findByOwnerId(ownerId: string, page: number, limit: number): Promise<PaginatedResult<RentPayment>>;
  findExpiredPayments(): Promise<RentPayment[]>;
  update(payment: RentPayment): Promise<RentPayment>;
}
