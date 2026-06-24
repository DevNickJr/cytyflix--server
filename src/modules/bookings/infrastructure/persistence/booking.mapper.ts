import { Booking, PaymentStatus, BookingStatus } from "../../domain/booking";
import { BookingOrmEntity } from "./booking.orm-entity";

export class BookingMapper {
  static toDomain(entity: BookingOrmEntity): Booking {
    return new Booking(
      entity.id,
      entity.clientId,
      entity.agentId,
      entity.propertyId,
      Number(entity.amount),
      entity.paymentReference,
      entity.paymentStatus as PaymentStatus,
      entity.bookingStatus as BookingStatus,
      entity.clientConfirmed,
      entity.agentConfirmed,
      entity.scheduledDate,
      entity.scheduledTime,
      entity.notes,
      entity.expiresAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(booking: Booking): BookingOrmEntity {
    const entity = new BookingOrmEntity();
    entity.id = booking.id;
    entity.clientId = booking.clientId;
    entity.agentId = booking.agentId;
    entity.propertyId = booking.propertyId;
    entity.amount = booking.amount;
    entity.paymentReference = booking.paymentReference;
    entity.paymentStatus = booking.paymentStatus;
    entity.bookingStatus = booking.bookingStatus;
    entity.clientConfirmed = booking.clientConfirmed;
    entity.agentConfirmed = booking.agentConfirmed;
    entity.scheduledDate = booking.scheduledDate;
    entity.scheduledTime = booking.scheduledTime;
    entity.notes = booking.notes;
    entity.expiresAt = booking.expiresAt;
    entity.createdAt = booking.createdAt;
    entity.updatedAt = booking.updatedAt;
    return entity;
  }
}
