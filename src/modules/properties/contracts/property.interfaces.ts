import { Property } from "@/modules/properties/domain/property";
import { SearchByLocationQuery } from "@/modules/users/contracts/user.interfaces";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchFilters {
  city?: string;
  lga?: string;
  state?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "price";
  sortOrder?: "ASC" | "DESC";
}

export interface PropertyRepository {
  create(property: Property): Promise<Property>;
  findById(id: string): Promise<Property | null>;
  findByOwnerId(ownerId: string, query: SearchByLocationQuery): Promise<PaginatedResult<Property>>;
  update(property: Property): Promise<Property>;
  delete(id: string): Promise<void>;
  search(filters: SearchFilters): Promise<PaginatedResult<Property>>;
}
