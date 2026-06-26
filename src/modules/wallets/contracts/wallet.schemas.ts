import z from "zod";

export const WithdrawSchema = z.object({
  body: z.object({
    amount: z.number().positive().min(100),
    beneficiaryId: z.string().min(1).optional(),
    bankCode: z.string().min(1).optional(),
    accountNumber: z.string().length(10).optional(),
    accountName: z.string().min(1).optional(),
  }),
});

export type WithdrawDTO = z.infer<typeof WithdrawSchema>["body"];

export const AddBeneficiarySchema = z.object({
  body: z.object({
    bankCode: z.string().min(1),
    bankName: z.string().min(1),
    accountNumber: z.string().length(10),
    accountName: z.string().min(1),
  }),
});

export type AddBeneficiaryDTO = z.infer<typeof AddBeneficiarySchema>["body"];

export const ResolveAccountSchema = z.object({
  query: z.object({
    account_number: z.string().length(10),
    bank_code: z.string().min(1),
  }),
});

export type ResolveAccountDTO = z.infer<typeof ResolveAccountSchema>["query"];
