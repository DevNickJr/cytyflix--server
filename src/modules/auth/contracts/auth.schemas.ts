import z from "zod";

export const CreateUserSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  })
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>["body"];

export const LoginUserSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
    rememberMe: z.boolean().default(false)
  })
});

export type LoginUserDTO = z.infer<typeof LoginUserSchema>["body"];