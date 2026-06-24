import z from "zod";

export const CreatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    propertyType: z.enum(["apartment", "house", "studio", "duplex", "self_contain", "shared"]),
    listingType: z.enum(["rent", "shortlet"]),
    price: z.number().positive(),
    currency: z.string().default("NGN"),
    address: z.string().min(5).max(500),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    country: z.string().default("Nigeria"),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    bedrooms: z.number().int().min(0).default(1),
    bathrooms: z.number().int().min(0).default(1),
    amenities: z.array(z.string()).default([]),
    proofOfOwnership: z.array(z.string().url()).min(1, "At least one proof of ownership image required"),
    interiorImages: z.array(z.string().url()).min(1, "At least one interior image required"),
    exteriorImages: z.array(z.string().url()).min(1, "At least one exterior image required"),
    streetImages: z.array(z.string().url()).default([]),
  })
});

export type CreatePropertyDTO = z.infer<typeof CreatePropertySchema>["body"];

export const UpdatePropertySchema = z.object({
  body: CreatePropertySchema.shape.body.partial()
})

export type UpdatePropertyDTO = z.infer<typeof UpdatePropertySchema>["body"];

export const SearchPropertyQuerySchema = z.object({
  query: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    propertyType: z.enum(["apartment", "house", "studio", "duplex", "self_contain", "shared"]).optional(),
    listingType: z.enum(["rent", "shortlet"]).optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    bedrooms: z.coerce.number().int().min(0).optional(),
    bathrooms: z.coerce.number().int().min(0).optional(),
    amenities: z.string().optional(), // comma-separated
    page: z.string({ error: 'page must be a number' })
      .refine(val => parseInt(val || '1'))
      .transform(val => parseInt(val || '1', 10)) // convert string → number
      .pipe(
        z
          .number({ error: 'page must be a number' })
          .int({ error: 'page must be an integer' })
          .positive({ error: 'page must be a positive number' })
      )
      .optional()
      .default(1),
    limit: z.string({ error: 'limit must be a number' })
      .refine(val => parseInt(val || '1'))
      .transform(val => parseInt(val || '1', 10)) // convert string → number
      .pipe(
        z
          .number({ error: 'limit must be a number' })
          .int({ error: 'limit must be an integer' })
          .positive({ error: 'limit must be a positive number' })
      )
      .optional()
      .default(1),
    sortBy: z.enum(["createdAt", "price"]).default("createdAt"),
    sortOrder: z.enum(["ASC", "DESC"]).default("DESC"),
  })
});

export type SearchPropertyQuery = z.infer<typeof SearchPropertyQuerySchema>["query"];
