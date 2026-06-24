import { Booking } from "../domain/booking";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByClientId(clientId: string, page: number, limit: number): Promise<PaginatedResult<Booking>>;
  findByAgentId(agentId: string, page: number, limit: number): Promise<PaginatedResult<Booking>>;
  findByPaymentReference(reference: string): Promise<Booking | null>;
  findExpiredBookings(): Promise<Booking[]>;
  update(booking: Booking): Promise<Booking>;
}
