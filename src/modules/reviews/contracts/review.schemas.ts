import z from "zod";

export const CreateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1).max(2000),
  }),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>["body"];

export const UpdateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1).max(2000).optional(),
  }),
});

export type UpdateReviewDTO = z.infer<typeof UpdateReviewSchema>["body"];
