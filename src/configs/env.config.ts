import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4001),

  // database
  DB_TYPE: z.enum(['better-sqlite3', 'postgres']).default('better-sqlite3'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASS: z.string().default('postgres'),
  DB_NAME: z.string().default('database.sqlite'),

  // auth
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z
    .string()
    .transform(val => parseInt(val))
    .default(36000),

  ALLOWED_HOSTS: z.string().optional(),

  // Firebase
  FIREBASE_PROJECT_ID: z.string().default(''),
  FIREBASE_PRIVATE_KEY: z.string().default(''),
  FIREBASE_CLIENT_EMAIL: z.string().default(''),

  // Paystack
  PAYSTACK_SECRET_KEY: z.string().default(''),
  PAYSTACK_PUBLIC_KEY: z.string().default(''),

  // Email
  EMAIL_PROVIDER: z.enum(['brevo', 'ses']).default('brevo'),
  BREVO_API_KEY: z.string().default(''),
  EMAIL_DEFAULT_FROM: z.string().default('noreply@cytyflix.com'),
  EMAIL_DEFAULT_FROM_NAME: z.string().default('Cytyflix'),
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
