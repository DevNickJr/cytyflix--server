import z from 'zod';

export const CreateAgreementSchema = z.object({
  body: z.object({
    propertyId: z
      .string({ error: 'Property ID is required' })
      .uuid({ error: 'Property ID must be a valid UUID' }),
    tenantId: z
      .string({ error: 'Tenant ID is required' })
      .uuid({ error: 'Tenant ID must be a valid UUID' }),
    agreementContent: z
      .string({ error: 'Agreement content is required' })
      .min(50, {
        error: 'Agreement content must be at least 50 characters long',
      }),
  }),
});

export type CreateAgreementDTO = z.infer<typeof CreateAgreementSchema>['body'];

export const SignAgreementSchema = z.object({
  body: z.object({
    signatureUrl: z
      .string({ error: 'Signature URL is required' })
      .url({ error: 'Signature URL must be a valid URL' }),
  }),
});

export type SignAgreementDTO = z.infer<typeof SignAgreementSchema>['body'];
