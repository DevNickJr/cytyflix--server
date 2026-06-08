import z from "zod";

export const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;