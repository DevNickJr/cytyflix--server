import z from 'zod';

export const CreateInquirySchema = z.object({
  propertyId: z
    .string({ error: 'Property ID is required' })
    .uuid({ error: 'Property ID must be a valid UUID' }),
  message: z
    .string({ error: 'Message is required' })
    .min(10, { error: 'Message must be at least 10 characters long' })
    .max(2000, { error: 'Message must be at most 2000 characters long' }),
});

export type CreateInquiryDTO = z.infer<typeof CreateInquirySchema>;

export const UpdateInquiryStatusSchema = z.object({
  status: z.enum(['responded', 'closed'], { error: 'Invalid status' }),
});

export type UpdateInquiryStatusDTO = z.infer<typeof UpdateInquiryStatusSchema>;
