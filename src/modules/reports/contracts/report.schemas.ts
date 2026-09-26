import z from 'zod';

export const CreateReportSchema = z.object({
  body: z.object({
    reason: z.enum(
      ['misleading', 'scam', 'inappropriate', 'duplicate', 'other'],
      { error: 'Invalid report reason' }
    ),
    description: z
      .string({ error: 'Description is required' })
      .min(10, { error: 'Description must be at least 10 characters long' })
      .max(2000, { error: 'Description must be at most 2000 characters long' }),
  }),
});

export type CreateReportDTO = z.infer<typeof CreateReportSchema>['body'];

export const ReviewReportSchema = z.object({
  body: z.object({
    status: z.enum(['reviewed', 'dismissed'], {
      error: 'Invalid review status',
    }),
  }),
});

export type ReviewReportDTO = z.infer<typeof ReviewReportSchema>['body'];
