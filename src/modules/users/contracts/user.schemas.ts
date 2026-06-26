import z from "zod";
import { RolesEnum } from "./user.interfaces";

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().min(7).max(20).optional(),
  bio: z.string().max(500).optional(),
  preferredLocation: z.string().max(200).optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  profileImage: z.string().url().optional(),
  operatingStates: z.array(z.string()).optional(),
  operatingLgas: z.array(z.string()).optional(),
  operatingCities: z.array(z.string()).optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;

export const UpdateRoleSchema = z.object({
  body: z.object({
    userId: z.string().min(1, { error: "userId must be provided" }),
    role: z.enum(RolesEnum, {
      error: "Role must be one of the approved roles"
    }),
  })
});

export type UpdateRoleDTO = z.infer<typeof UpdateRoleSchema>["body"];

export const UpdateSlugSchema = z.object({
  body: z.object({
    slug: z.string()
      .min(3, { error: "Slug must be at least 3 characters" })
      .max(50, { error: "Slug must be at most 50 characters" })
      .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
        error: "Slug must be lowercase alphanumeric with hyphens, starting and ending with an alphanumeric character",
      }),
  }),
});

export type UpdateSlugDTO = z.infer<typeof UpdateSlugSchema>["body"];