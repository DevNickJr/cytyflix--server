import z from "zod";

export const CreateAgreementSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid(),
    tenantId: z.string().uuid(),
    agreementContent: z.string().min(50, "Agreement content must be at least 50 characters"),
  }),
});

export type CreateAgreementDTO = z.infer<typeof CreateAgreementSchema>["body"];

export const SignAgreementSchema = z.object({
  body: z.object({
    signatureUrl: z.string().url(),
  }),
});

export type SignAgreementDTO = z.infer<typeof SignAgreementSchema>["body"];
