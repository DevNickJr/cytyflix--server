import { Inquiry } from "@/modules/inquiries/domain/inquiry";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface InquiryRepository {
  create(inquiry: Inquiry): Promise<Inquiry>;
  findById(id: string): Promise<Inquiry | null>;
  findBySenderId(senderId: string, page: number, limit: number): Promise<PaginatedResult<Inquiry>>;
  findByRecipientId(recipientId: string, page: number, limit: number): Promise<PaginatedResult<Inquiry>>;
  findByPropertyId(propertyId: string, page: number, limit: number): Promise<PaginatedResult<Inquiry>>;
  update(inquiry: Inquiry): Promise<Inquiry>;
}
