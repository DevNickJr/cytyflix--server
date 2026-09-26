import z from 'zod';

export const CreateNotificationSchema = z.object({
  userId: z
    .string({ error: 'User ID is required' })
    .uuid({ error: 'User ID must be a valid UUID' }),
  type: z.enum(
    ['inquiry_received', 'inquiry_responded', 'listing_saved', 'system'],
    { error: 'Type must be a valid notification type' }
  ),
  title: z
    .string({ error: 'Title is required' })
    .min(1, { error: 'Title is required' })
    .max(200, { error: 'Title must be at most 200 characters long' }),
  message: z
    .string({ error: 'Message is required' })
    .min(1, { error: 'Message is required' })
    .max(1000, { error: 'Message must be at most 1000 characters long' }),
  metadata: z.record(z.string(), z.any()).default({}),
});

export type CreateNotificationDTO = z.infer<typeof CreateNotificationSchema>;
