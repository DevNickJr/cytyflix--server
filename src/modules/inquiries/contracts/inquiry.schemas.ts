import z from "zod";

export const CreateInquirySchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(10).max(2000),
});

export type CreateInquiryDTO = z.infer<typeof CreateInquirySchema>;

export const UpdateInquiryStatusSchema = z.object({
  status: z.enum(["responded", "closed"]),
});

export type UpdateInquiryStatusDTO = z.infer<typeof UpdateInquiryStatusSchema>;
