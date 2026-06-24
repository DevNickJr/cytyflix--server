import { Property, PropertyType, ListingType } from "../../domain/property";
import { PropertyOrmEntity } from "./property.orm-entity";

export class PropertyMapper {
  static toDomain(entity: PropertyOrmEntity): Property {
    return new Property(
      entity.id,
      entity.title,
      entity.description,
      entity.propertyType as PropertyType,
      entity.listingType as ListingType,
      Number(entity.price),
      entity.currency,
      entity.address,
      entity.city,
      entity.lga,
      entity.state,
      entity.country,
      entity.latitude ? Number(entity.latitude) : undefined,
      entity.longitude ? Number(entity.longitude) : undefined,
      entity.bedrooms,
      entity.bathrooms,
      entity.amenities || [],
      entity.proofOfOwnership || [],
      entity.interiorImages || [],
      entity.exteriorImages || [],
      entity.streetImages || [],
      entity.isAvailable,
      entity.isFeatured,
      entity.ownerId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(property: Property): PropertyOrmEntity {
    const entity = new PropertyOrmEntity();

    entity.id = property.id;
    entity.title = property.title;
    entity.description = property.description;
    entity.propertyType = property.propertyType;
    entity.listingType = property.listingType;
    entity.price = property.price;
    entity.currency = property.currency;
    entity.address = property.address;
    entity.city = property.city;
    entity.lga = property.lga;
    entity.state = property.state;
    entity.country = property.country;
    entity.latitude = property.latitude;
    entity.longitude = property.longitude;
    entity.bedrooms = property.bedrooms;
    entity.bathrooms = property.bathrooms;
    entity.amenities = property.amenities;
    entity.proofOfOwnership = property.proofOfOwnership;
    entity.interiorImages = property.interiorImages;
    entity.exteriorImages = property.exteriorImages;
    entity.streetImages = property.streetImages;
    entity.isAvailable = property.isAvailable;
    entity.isFeatured = property.isFeatured;
    entity.ownerId = property.ownerId;
    entity.createdAt = property.createdAt;
    entity.updatedAt = property.updatedAt;

    return entity;
  }
}
