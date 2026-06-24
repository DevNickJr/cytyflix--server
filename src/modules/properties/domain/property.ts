export enum PropertyType {
  APARTMENT = "apartment",
  HOUSE = "house",
  STUDIO = "studio",
  DUPLEX = "duplex",
  SELF_CONTAIN = "self_contain",
  SHARED = "shared",
}

export enum ListingType {
  RENT = "rent",
  SHORTLET = "shortlet",
}

export class Property {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public propertyType: PropertyType,
    public listingType: ListingType,
    public price: number,
    public currency: string = "NGN",
    public address: string,
    public city: string,
    public state: string,
    public country: string = "Nigeria",
    public latitude?: number,
    public longitude?: number,
    public bedrooms: number = 1,
    public bathrooms: number = 1,
    public amenities: string[] = [],
    public proofOfOwnership: string[] = [],
    public interiorImages: string[] = [],
    public exteriorImages: string[] = [],
    public streetImages: string[] = [],
    public isAvailable: boolean = true,
    public isFeatured: boolean = false,
    public ownerId: string = "",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
