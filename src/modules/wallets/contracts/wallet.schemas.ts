import z from 'zod';

export const WithdrawSchema = z.object({
  body: z.object({
    amount: z
      .number({ error: 'Amount must be a number' })
      .positive({ error: 'Amount must be a positive number' })
      .min(100, { error: 'Amount must be at least 100' }),
    beneficiaryId: z
      .string({ error: 'Beneficiary ID must be a string' })
      .min(1, { error: 'Beneficiary ID is required' })
      .optional(),
    bankCode: z
      .string({ error: 'Bank Code must be a string' })
      .min(1, { error: 'Bank Code is required' })
      .optional(),
    accountNumber: z
      .string({ error: 'Account Number must be a string' })
      .length(10, { error: 'Account Number must be 10 characters long' })
      .optional(),
    accountName: z
      .string({ error: 'Account Name must be a string' })
      .min(1, { error: 'Account Name is required' })
      .optional(),
  }),
});

export type WithdrawDTO = z.infer<typeof WithdrawSchema>['body'];

export const AddBeneficiarySchema = z.object({
  body: z.object({
    bankCode: z
      .string({ error: 'Bank Code must be a string' })
      .min(1, { error: 'Bank Code is required' }),
    bankName: z
      .string({ error: 'Bank Name must be a string' })
      .min(1, { error: 'Bank Name is required' }),
    accountNumber: z
      .string({ error: 'Account Number must be a string' })
      .length(10, { error: 'Account Number must be 10 characters long' }),
    accountName: z
      .string({ error: 'Account Name must be a string' })
      .min(1, { error: 'Account Name is required' }),
  }),
});

export type AddBeneficiaryDTO = z.infer<typeof AddBeneficiarySchema>['body'];

export const ResolveAccountSchema = z.object({
  query: z.object({
    account_number: z
      .string({ error: 'Account Number must be a string' })
      .length(10, { error: 'Account Number must be 10 characters long' }),
    bank_code: z
      .string({ error: 'Bank Code must be a string' })
      .min(1, { error: 'Bank Code is required' }),
  }),
});

export type ResolveAccountDTO = z.infer<typeof ResolveAccountSchema>['query'];
