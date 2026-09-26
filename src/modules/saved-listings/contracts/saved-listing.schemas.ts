import z from 'zod';

export const SavePropertySchema = z.object({
  propertyId: z
    .string({ error: 'Property ID is required' })
    .uuid({ error: 'Property ID must be a valid UUID' }),
});

export type SavePropertyDTO = z.infer<typeof SavePropertySchema>;
