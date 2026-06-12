export class SavedListing {
  constructor(
    public readonly id: string,
    public userId: string,
    public propertyId: string,
    public createdAt: Date = new Date(),
  ) {}
}
