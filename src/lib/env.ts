import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("Must be a valid Supabase URL").default('https://placeholder-project.supabase.co'),
  VITE_SUPABASE_ANON_KEY: z.string().min(10, "Anon key must be at least 10 characters").default('placeholder-anon-key-string-long-enough'),
});

let parsedEnv;
try {
  parsedEnv = envSchema.parse({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  });
} catch (error) {
  console.warn("Project AURUM Env Validation warning. Using fallback placeholder credentials:", error);
  parsedEnv = envSchema.parse({
    VITE_SUPABASE_URL: 'https://placeholder-project.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'placeholder-anon-key-string-long-enough-for-auth',
  });
}

export const ENV = parsedEnv;
export type EnvConfig = z.infer<typeof envSchema>;
