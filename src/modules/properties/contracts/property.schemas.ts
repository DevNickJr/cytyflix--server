import z from 'zod';

export const CreatePropertySchema = z.object({
  body: z.object({
    title: z
      .string({
        error: 'Title is required',
      })
      .min(3, { error: 'Title must be at least 3 characters long' })
      .max(200, { error: 'Title must be at most 200 characters long' }),
    description: z
      .string({
        error: 'Description is required',
      })
      .min(10, { error: 'Description must be at least 10 characters long' })
      .max(5000, { error: 'Description must be at most 5000 characters long' }),
    propertyType: z.enum(
      [
        'apartment',
        'house',
        'studio',
        'duplex',
        'bungalow',
        'self_contain',
        'shared',
        'land',
        'office',
        'warehouse',
      ],
      { error: 'Property type is required' }
    ),
    listingType: z.enum(['rent', 'shortlet', 'sale'], {
      error: 'Listing type is required',
    }),
    price: z
      .number({
        error: 'Price is required',
      })
      .positive({ error: 'Price must be a positive number' }),
    pricePeriod: z
      .enum(['day', 'week', 'month', 'year', 'one_off'], {
        error: 'Price period is required',
      })
      .default('month'),
    negotiable: z.boolean().default(false),
    currency: z.string().default('NGN'),
    address: z
      .string({
        error: 'Address is required',
      })
      .min(5, { error: 'Address must be at least 5 characters long' })
      .max(500, { error: 'Address must be at most 500 characters long' }),
    lga: z.string().min(1, { error: 'LGA must be selected' }),
    city: z.string().min(1, { error: 'City must be selected' }),
    state: z.string().min(1, { error: 'State must be selected' }),
    country: z.string().default('Nigeria'),
    latitude: z
      .number({
        error: 'Latitude is required',
      })
      .min(-90, { message: 'Latitude must be greater than or equal to -90' })
      .max(90, { message: 'Latitude must be less than or equal to 90' })
      .optional(),
    longitude: z
      .number({
        error: 'Longitude is required',
      })
      .min(-180, { message: 'Longitude must be greater than or equal to -180' })
      .max(180, { message: 'Longitude must be less than or equal to 180' })
      .optional(),
    bedrooms: z
      .number({
        error: 'Bedrooms must be a number',
      })
      .int()
      .min(0)
      .default(1),
    bathrooms: z
      .number({
        error: 'Bathrooms must be a number',
      })
      .int()
      .min(0)
      .default(1),
    amenities: z
      .array(z.string({ error: 'Amenities must be an array of strings' }))
      .default([]),
    proofOfOwnership: z
      .array(
        z.string().url({
          error: 'Proof of ownership must be an array of strings',
        })
      )
      .default([]),
    images: z
      .array(
        z.string().url({
          error: 'Images must be an array of strings',
        })
      )
      .min(1, 'At least one image required'),
    // interiorImages: z
    //   .array(z.string().url())
    //   .min(1, 'At least one interior image required'),
    // exteriorImages: z
    //   .array(z.string().url())
    //   .min(1, 'At least one exterior image required'),
    // streetImages: z.array(z.string().url()).default([]),
    walkthroughVideo: z
      .string({ error: 'Walkthrough video must be a string' })
      .url('Valid walkthrough video URL is required')
      .optional()
      .or(z.literal('')),
  }),
});

export type CreatePropertyDTO = z.infer<typeof CreatePropertySchema>['body'];

export const UpdatePropertySchema = z.object({
  body: CreatePropertySchema.shape.body.partial(),
});

export type UpdatePropertyDTO = z.infer<typeof UpdatePropertySchema>['body'];

export const SearchPropertyQuerySchema = z.object({
  query: z.object({
    city: z.string({ error: 'City must be a string' }).optional(),
    lga: z.string({ error: 'LGA must be a string' }).optional(),
    state: z.string({ error: 'State must be a string' }).optional(),
    propertyType: z
      .enum(
        ['apartment', 'house', 'studio', 'duplex', 'self_contain', 'shared'],
        {
          error:
            'Property type must be one of apartment, house, studio, duplex, self_contain, shared',
        }
      )
      .optional(),
    listingType: z
      .enum(['rent', 'shortlet', 'sale'], {
        error: 'Listing type must be one of rent, shortlet, sale',
      })
      .optional(),
    minPrice: z.coerce
      .number()
      .positive({ error: 'Minimum price must be a positive number' })
      .optional(),
    maxPrice: z.coerce
      .number()
      .positive({ error: 'Maximum price must be a positive number' })
      .optional(),
    bedrooms: z.coerce
      .number()
      .int({ error: 'Bedrooms must be an integer' })
      .min(0, { error: 'Bedrooms must be a positive number' })
      .optional(),
    bathrooms: z.coerce
      .number()
      .int({ error: 'Bathrooms must be an integer' })
      .min(0, { error: 'Bathrooms must be a positive number' })
      .optional(),
    amenities: z.string({ error: 'Amenities must be a string' }).optional(), // comma-separated
    page: z
      .string({ error: 'page must be a number' })
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
    limit: z
      .string({ error: 'limit must be a number' })
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
    sortBy: z
      .enum(['createdAt', 'price'], {
        error: 'Sort by must be one of createdAt or price',
      })
      .default('createdAt'),
    sortOrder: z
      .enum(['ASC', 'DESC'], { error: 'Sort order must be one of ASC or DESC' })
      .default('DESC'),
  }),
});

export type SearchPropertyQuery = z.infer<
  typeof SearchPropertyQuerySchema
>['query'];
