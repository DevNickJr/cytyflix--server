import { Inquiry, InquiryStatus } from "../../domain/inquiry";
import { InquiryOrmEntity } from "./inquiry.orm-entity";

export class InquiryMapper {
  static toDomain(entity: InquiryOrmEntity): Inquiry {
    return new Inquiry(
      entity.id,
      entity.senderId,
      entity.propertyId,
      entity.recipientId,
      entity.message,
      entity.status as InquiryStatus,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(inquiry: Inquiry): InquiryOrmEntity {
    const entity = new InquiryOrmEntity();
    entity.id = inquiry.id;
    entity.senderId = inquiry.senderId;
    entity.propertyId = inquiry.propertyId;
    entity.recipientId = inquiry.recipientId;
    entity.message = inquiry.message;
    entity.status = inquiry.status;
    entity.createdAt = inquiry.createdAt;
    entity.updatedAt = inquiry.updatedAt;
    return entity;
  }
}
