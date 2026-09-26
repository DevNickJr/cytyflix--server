import z, { property } from 'zod';

export const CreateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({ error: 'Rating must be a number' })
      .int({ error: 'Rating must be an integer' })
      .min(1, { error: 'Rating must be at least 1' })
      .max(5, { error: 'Rating must be at most 5' }),
    comment: z
      .string({ error: 'Comment is required' })
      .min(1, { error: 'Comment is required' })
      .max(2000, { error: 'Comment must be at most 2000 characters long' }),
  }),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>['body'];

export const UpdateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({ error: 'Rating must be a number' })
      .int({ error: 'Rating must be an integer' })
      .min(1, { error: 'Rating must be at least 1' })
      .max(5, { error: 'Rating must be at most 5' })
      .optional(),
    comment: z
      .string({ error: 'Comment is required' })
      .min(1, { error: 'Comment is required' })
      .max(2000, { error: 'Comment must be at most 2000 characters long' })
      .optional(),
  }),
});

export type UpdateReviewDTO = z.infer<typeof UpdateReviewSchema>['body'];

export const PropertyIdParam = z.object({
  params: z.object({
    propertyId: z.string().min(1, { error: 'propertyId must be a string' }),
  }),
});

export type PropertyIdParamDTO = z.infer<typeof PropertyIdParam>['params'];

export const IdAndPropertyIdParam = z.object({
  params: z.object({
    id: z.string().min(1, { error: 'Id must be a string' }),
    propertyId: z.string().min(1, { error: 'propertyId must be a string' }),
  }),
});

export type IdAndPropertyIdParamDTO = z.infer<
  typeof IdAndPropertyIdParam
>['params'];
