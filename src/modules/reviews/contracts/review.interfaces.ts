import { Review } from "../domain/review";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface ReviewRepository {
  create(review: Review): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findByPropertyId(propertyId: string, page: number, limit: number): Promise<PaginatedResult<Review>>;
  findByUserAndProperty(userId: string, propertyId: string): Promise<Review | null>;
  getAverageRating(propertyId: string): Promise<{ average: number; count: number }>;
  update(review: Review): Promise<Review>;
  delete(id: string): Promise<void>;
}
