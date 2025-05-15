import { z } from "zod";

const envSchema = z.object({
  VITE_DEV_DOMAIN: z.string(),
});

export const env = envSchema.parse(import.meta.env);
