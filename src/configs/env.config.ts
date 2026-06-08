import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4001),

  // auth
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z
    .string()
    .transform(val => parseInt(val))
    .default(36000),

  ALLOWED_HOSTS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}
const env = parsed.data;

// Export the parsed environment variables for use in your applicatio
export default env;
