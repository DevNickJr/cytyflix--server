
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public role: 'user' | 'agent' | 'admin' = 'user',
    public profile?: UserProfile,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
export class UserProfile {
  constructor(
    public firstName: string,
    public lastName: string,
    public phoneNumber: string,
    public bio?: string,
    public preferredLocation?: string,
    public budgetMin?: number,
    public budgetMax?: number,
    public profileImage?: string
  ) {}

  // business rules
}