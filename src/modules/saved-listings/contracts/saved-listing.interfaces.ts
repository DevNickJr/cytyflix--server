import { SavedListing } from "@/modules/saved-listings/domain/saved-listing";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface SavedListingRepository {
  save(savedListing: SavedListing): Promise<SavedListing>;
  delete(userId: string, propertyId: string): Promise<void>;
  findByUserAndProperty(userId: string, propertyId: string): Promise<SavedListing | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<PaginatedResult<SavedListing>>;
}
