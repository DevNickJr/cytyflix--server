import { SavedListing } from "../../domain/saved-listing";
import { SavedListingOrmEntity } from "./saved-listing.orm-entity";

export class SavedListingMapper {
  static toDomain(entity: SavedListingOrmEntity): SavedListing {
    return new SavedListing(
      entity.id,
      entity.userId,
      entity.propertyId,
      entity.createdAt,
    );
  }

  static toPersistence(savedListing: SavedListing): SavedListingOrmEntity {
    const entity = new SavedListingOrmEntity();
    entity.id = savedListing.id;
    entity.userId = savedListing.userId;
    entity.propertyId = savedListing.propertyId;
    entity.createdAt = savedListing.createdAt;
    return entity;
  }
}
