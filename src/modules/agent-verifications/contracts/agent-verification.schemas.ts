import z from "zod";

export const SubmitVerificationSchema = z.object({
  body: z.object({
    idDocumentUrl: z.string().url("Valid ID document URL is required"),
    selfieUrl: z.string().url("Valid selfie URL is required"),
    utilityBillUrl: z.string().url("Valid utility bill URL is required"),
    ninNumber: z.string().length(16, "Virtual NIN must be exactly 16 characters").optional(),
  }),
});

export type SubmitVerificationDTO = z.infer<typeof SubmitVerificationSchema>["body"];

export const ReviewVerificationSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().min(1).max(1000).optional(),
  }),
});

export type ReviewVerificationDTO = z.infer<typeof ReviewVerificationSchema>["body"];
