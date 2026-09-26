import z from 'zod';
import { RolesEnum } from './user.interfaces';

export const UpdateProfileSchema = z.object({
  firstName: z
    .string({ error: 'First Name must be a string' })
    .min(1, { error: 'First Name is required' })
    .max(100, { error: 'First Name must be at most 100 characters long' })
    .optional(),
  lastName: z
    .string({ error: 'Last Name must be a string' })
    .min(1, { error: 'Last Name is required' })
    .max(100, { error: 'Last Name must be at most 100 characters long' })
    .optional(),
  phoneNumber: z
    .string({ error: 'Phone Number must be a string' })
    .min(7, { error: 'Phone Number must be at least 7 characters long' })
    .max(20, { error: 'Phone Number must be at most 20 characters long' })
    .optional(),
  bio: z
    .string({ error: 'Bio must be a string' })
    .max(500, { error: 'Bio must be at most 500 characters long' })
    .optional(),
  preferredLocation: z
    .string({ error: 'Preferred Location must be a string' })
    .max(200, {
      error: 'Preferred Location must be at most 200 characters long',
    })
    .optional(),
  budgetMin: z
    .number({ error: 'Budget Min must be a number' })
    .positive({ error: 'Budget Min must be a positive number' })
    .optional(),
  budgetMax: z
    .number({ error: 'Budget Max must be a number' })
    .positive({ error: 'Budget Max must be a positive number' })
    .optional(),
  profileImage: z
    .string({ error: 'Profile Image must be a valid URL' })
    .url({ error: 'Profile Image must be a valid URL' })
    .optional(),
  operatingStates: z
    .array(z.string({ error: 'State must be a string' }))
    .optional(),
  operatingLgas: z
    .array(z.string({ error: 'LGA must be a string' }))
    .optional(),
  operatingCities: z
    .array(z.string({ error: 'City must be a string' }))
    .optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;

export const UpdateRoleSchema = z.object({
  body: z.object({
    userId: z
      .string({ error: 'User ID must be a string' })
      .min(1, { error: 'User ID is required' }),
    role: z.enum(RolesEnum, {
      error: 'Role must be one of the approved roles',
    }),
  }),
});

export type UpdateRoleDTO = z.infer<typeof UpdateRoleSchema>['body'];

export const UpdateSlugSchema = z.object({
  body: z.object({
    slug: z
      .string({ error: 'Slug must be a string' })
      .min(3, { error: 'Slug must be at least 3 characters' })
      .max(50, { error: 'Slug must be at most 50 characters' })
      .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
        error:
          'Slug must be lowercase alphanumeric with hyphens, starting and ending with an alphanumeric character',
      }),
  }),
});

export type UpdateSlugDTO = z.infer<typeof UpdateSlugSchema>['body'];
