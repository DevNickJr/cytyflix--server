import z from 'zod';

export const CreateRentPaymentSchema = z.object({
  body: z.object({
    propertyId: z
      .string({ error: 'Property ID is required' })
      .min(1, { error: 'Property ID is required' }),
    ownerId: z
      .string({ error: 'Owner ID is required' })
      .min(1, { error: 'Owner ID is required' }),
    amount: z
      .number({ error: 'Amount is required' })
      .positive({ error: 'Amount must be a positive number' }),
    moveInDate: z
      .string({ error: 'Move in date is required' })
      .min(1, { error: 'Move in date is required' }),
  }),
});

export type CreateRentPaymentDTO = z.infer<
  typeof CreateRentPaymentSchema
>['body'];
