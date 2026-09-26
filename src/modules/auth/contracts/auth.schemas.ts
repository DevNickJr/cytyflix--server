import z from 'zod';

export const CreateUserSchema = z.object({
  body: z.object({
    email: z.email({ error: 'Email must be a valid mail' }),
    password: z
      .string({ error: 'Password is required' })
      .min(8, { error: 'Password must be at least 8 characters long' }),
  }),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>['body'];

export const LoginUserSchema = z.object({
  body: z.object({
    email: z.email({ error: 'Email must be a valid mail' }),
    password: z
      .string({ error: 'Password is required' })
      .min(8, { error: 'Password must be at least 8 characters long' }),
    rememberMe: z
      .boolean({ error: 'Remember me must be a boolean' })
      .default(false),
  }),
});

export type LoginUserDTO = z.infer<typeof LoginUserSchema>['body'];
