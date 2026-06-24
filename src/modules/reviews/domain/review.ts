export class Review {
  constructor(
    public readonly id: string,
    public userId: string,
    public propertyId: string,
    public rating: number,
    public comment: string,
    public authorName?: string,
    public authorImage?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
