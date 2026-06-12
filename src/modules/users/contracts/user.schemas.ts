import z from "zod";

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().min(7).max(20).optional(),
  bio: z.string().max(500).optional(),
  preferredLocation: z.string().max(200).optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  profileImage: z.string().url().optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
