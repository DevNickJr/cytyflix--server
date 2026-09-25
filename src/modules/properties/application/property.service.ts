import crypto from 'crypto';
import {
  ListingType,
  Property,
  PropertyType,
} from '@/modules/properties/domain/property';
import {
  PropertyRepository,
  SearchFilters,
} from '@/modules/properties/contracts/property.interfaces';
import {
  CreatePropertyDTO,
  UpdatePropertyDTO,
  SearchPropertyQuery,
} from '@/modules/properties/contracts/property.schemas';
import CustomError from '@/shared/utils/custom-error';

export class PropertyService {
  constructor(private readonly propertyRepo: PropertyRepository) {}

  async createProperty(ownerId: string, dto: CreatePropertyDTO) {
    const property = new Property(
      crypto.randomUUID(),
      dto.title,
      dto.description,
      dto.propertyType as PropertyType,
      dto.listingType as ListingType,
      dto.price,
      dto.pricePeriod,
      dto.negotiable,
      dto.currency,
      dto.address,
      dto.city,
      dto.lga,
      dto.state,
      dto.country,
      dto.latitude,
      dto.longitude,
      dto.bedrooms,
      dto.bathrooms,
      dto.amenities,
      dto.proofOfOwnership,
      dto.images,
      // dto.interiorImages,
      // dto.exteriorImages,
      // dto.streetImages,
      dto.walkthroughVideo,
      true,
      false,
      false,
      undefined,
      ownerId
    );

    return this.propertyRepo.create(property);
  }

  async getProperty(id: string) {
    const property = await this.propertyRepo.findById(id);
    if (!property) throw new CustomError('Property not found', 404);
    return property;
  }

  async getPropertiesByOwner(query: {
    ownerId: string;
    page: number;
    limit: number;
  }) {
    return this.propertyRepo.findByOwnerId(query.ownerId, query);
  }

  async updateProperty(id: string, ownerId: string, dto: UpdatePropertyDTO) {
    const property = await this.propertyRepo.findById(id);
    if (!property) throw new CustomError('Property not found', 404);
    if (property.ownerId !== ownerId)
      throw new CustomError('You can only update your own listings', 403);

    if (dto.title !== undefined) property.title = dto.title;
    if (dto.description !== undefined) property.description = dto.description;
    if (dto.propertyType !== undefined)
      property.propertyType = dto.propertyType as PropertyType;
    if (dto.listingType !== undefined)
      property.listingType = dto.listingType as ListingType;
    if (dto.price !== undefined) property.price = dto.price;
    if (dto.pricePeriod !== undefined) property.pricePeriod = dto.pricePeriod;
    if (dto.negotiable !== undefined) property.negotiable = dto.negotiable;
    if (dto.currency !== undefined) property.currency = dto.currency;
    if (dto.address !== undefined) property.address = dto.address;
    if (dto.city !== undefined) property.city = dto.city;
    if (dto.lga !== undefined) property.lga = dto.lga;
    if (dto.state !== undefined) property.state = dto.state;
    if (dto.country !== undefined) property.country = dto.country;
    if (dto.latitude !== undefined) property.latitude = dto.latitude;
    if (dto.longitude !== undefined) property.longitude = dto.longitude;
    if (dto.bedrooms !== undefined) property.bedrooms = dto.bedrooms;
    if (dto.bathrooms !== undefined) property.bathrooms = dto.bathrooms;
    if (dto.amenities !== undefined) property.amenities = dto.amenities;
    if (dto.proofOfOwnership !== undefined)
      property.proofOfOwnership = dto.proofOfOwnership;
    if (dto.images !== undefined) property.images = dto.images;
    // if (dto.interiorImages !== undefined)
    //   property.interiorImages = dto.interiorImages;
    // if (dto.exteriorImages !== undefined)
    //   property.exteriorImages = dto.exteriorImages;
    // if (dto.streetImages !== undefined)
    //   property.streetImages = dto.streetImages;
    if (dto.walkthroughVideo !== undefined)
      property.walkthroughVideo = dto.walkthroughVideo;

    return this.propertyRepo.update(property);
  }

  async deleteProperty(id: string, ownerId: string) {
    const property = await this.propertyRepo.findById(id);
    if (!property) throw new CustomError('Property not found', 404);
    if (property.ownerId !== ownerId)
      throw new CustomError('You can only delete your own listings', 403);

    await this.propertyRepo.delete(id);
  }

  async searchProperties(query: SearchPropertyQuery) {
    const filters: SearchFilters = {
      city: query.city,
      lga: query.lga,
      state: query.state,
      propertyType: query.propertyType,
      listingType: query.listingType,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      bedrooms: query.bedrooms,
      bathrooms: query.bathrooms,
      amenities: query.amenities
        ? query.amenities.split(',').map(a => a.trim())
        : undefined,
      isAvailable: true,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    return this.propertyRepo.search(filters);
  }
}
