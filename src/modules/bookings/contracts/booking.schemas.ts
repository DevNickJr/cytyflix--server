import z from 'zod';

export const CreateBookingSchema = z.object({
  body: z.object({
    agentId: z
      .string({ error: 'Agent ID is required' })
      .min(1, { error: 'Agent ID is required' }),
    propertyId: z
      .string({ error: 'Property ID is required' })
      .min(1, { error: 'Property ID is required' })
      .default('any'),
    scheduledDate: z
      .string({ error: 'Scheduled date is required' })
      .min(1, { error: 'Scheduled date is required' }),
    scheduledTime: z
      .string({ error: 'Scheduled time is required' })
      .min(1, { error: 'Scheduled time is required' }),
    notes: z
      .string({ error: 'Notes must be a string' })
      .max(1000, { error: 'Notes must be at most 1000 characters long' })
      .optional(),
  }),
});

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>['body'];

export const UpdateBookingScheduleSchema = z.object({
  body: z
    .object({
      scheduledDate: z
        .string({ error: 'Scheduled date is required' })
        .min(1, { error: 'Scheduled date is required' })
        .optional(),
      scheduledTime: z
        .string({ error: 'Scheduled time is required' })
        .min(1, { error: 'Scheduled time is required' })
        .optional(),
    })
    .refine(data => data.scheduledDate || data.scheduledTime, {
      message:
        'At least one of scheduledDate or scheduledTime must be provided',
    }),
});

export type UpdateBookingScheduleDTO = z.infer<
  typeof UpdateBookingScheduleSchema
>['body'];
