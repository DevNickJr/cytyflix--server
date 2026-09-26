import z from 'zod';

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
