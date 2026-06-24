import z from "zod";

export const CreateReportSchema = z.object({
  body: z.object({
    reason: z.enum(["misleading", "scam", "inappropriate", "duplicate", "other"]),
    description: z.string().min(10).max(2000),
  }),
});

export type CreateReportDTO = z.infer<typeof CreateReportSchema>["body"];

export const ReviewReportSchema = z.object({
  body: z.object({
    status: z.enum(["reviewed", "dismissed"]),
  }),
});

export type ReviewReportDTO = z.infer<typeof ReviewReportSchema>["body"];
