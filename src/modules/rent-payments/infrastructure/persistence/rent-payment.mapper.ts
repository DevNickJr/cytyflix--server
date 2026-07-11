import { RentPayment, RentPaymentStatus } from "../../domain/rent-payment";
import { RentPaymentOrmEntity } from "./rent-payment.orm-entity";

export class RentPaymentMapper {
  static toDomain(entity: RentPaymentOrmEntity): RentPayment {
    return new RentPayment(
      entity.id,
      entity.propertyId,
      entity.tenantId,
      entity.ownerId,
      Number(entity.amount),
      entity.paymentReference,
      entity.paymentStatus,
      entity.status as RentPaymentStatus,
      entity.moveInDate,
      entity.tenantConfirmed,
      entity.confirmedAt,
      entity.releasedAt,
      entity.expiresAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(payment: RentPayment): RentPaymentOrmEntity {
    const entity = new RentPaymentOrmEntity();
    entity.id = payment.id;
    entity.propertyId = payment.propertyId;
    entity.tenantId = payment.tenantId;
    entity.ownerId = payment.ownerId;
    entity.amount = payment.amount;
    entity.paymentReference = payment.paymentReference;
    entity.paymentStatus = payment.paymentStatus;
    entity.status = payment.status;
    entity.moveInDate = payment.moveInDate;
    entity.tenantConfirmed = payment.tenantConfirmed;
    if (payment.confirmedAt) entity.confirmedAt = payment.confirmedAt;
    if (payment.releasedAt) entity.releasedAt = payment.releasedAt;
    if (payment.expiresAt) entity.expiresAt = payment.expiresAt;
    entity.createdAt = payment.createdAt;
    entity.updatedAt = payment.updatedAt;
    return entity;
  }
}
