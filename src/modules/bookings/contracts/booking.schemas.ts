import z from 'zod';

export const CreateBookingSchema = z.object({
  body: z.object({
    agentId: z.string().min(1),
    propertyId: z.string().min(1).default('any'),
    scheduledDate: z.string().min(1),
    scheduledTime: z.string().min(1),
    notes: z.string().max(1000).optional(),
  }),
});

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>['body'];

export const UpdateBookingScheduleSchema = z.object({
  body: z
    .object({
      scheduledDate: z.string().min(1).optional(),
      scheduledTime: z.string().min(1).optional(),
    })
    .refine(data => data.scheduledDate || data.scheduledTime, {
      message:
        'At least one of scheduledDate or scheduledTime must be provided',
    }),
});

export type UpdateBookingScheduleDTO = z.infer<
  typeof UpdateBookingScheduleSchema
>['body'];
