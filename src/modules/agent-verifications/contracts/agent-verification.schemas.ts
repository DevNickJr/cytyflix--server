import z from 'zod';

export const SubmitVerificationSchema = z.object({
  body: z.object({
    idDocumentUrl: z
      .string({
        error: 'ID document URL is required',
      })
      .url({ error: 'Valid ID document URL is required' }),
    selfieUrl: z
      .string({
        error: 'Selfie URL is required',
      })
      .url({ error: 'Valid selfie URL is required' }),
    utilityBillUrl: z
      .string({
        error: 'Utility bill URL is required',
      })
      .url({ error: 'Valid utility bill URL is required' }),
    ninNumber: z
      .string({
        error: 'Virtual NIN is required',
      })
      .length(16, 'Virtual NIN must be exactly 16 characters')
      .optional(),
  }),
});

export type SubmitVerificationDTO = z.infer<
  typeof SubmitVerificationSchema
>['body'];

export const ReviewVerificationSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected'], {
      error: 'Status is required',
    }),
    rejectionReason: z
      .string()
      .min(1, {
        error: 'Rejection reason is required',
      })
      .max(1000, {
        error: 'Rejection reason must be at most 1000 characters long',
      })
      .optional(),
  }),
});

export type ReviewVerificationDTO = z.infer<
  typeof ReviewVerificationSchema
>['body'];
