import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.string().url(),
    ACCESS_TOKEN_NAME: z.string().min(1),
    REFRESH_TOKEN_NAME: z.string().min(1),
    ACCESS_TOKEN_EXPIRATION: z.coerce.number(),
    REFRESH_TOKEN_EXPIRATION: z.coerce.number(),
    NODE_ENV: z.enum(["production", "development"]),
    APP_NAME: z.string().min(1),
    APP_DOMAIN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
    NEXT_PUBLIC_ACCESS_TOKEN_NAME: z.string().min(1),
    NEXT_PUBLIC_REFRESH_TOKEN_NAME: z.string().min(1),
    NEXT_PUBLIC_ACCESS_TOKEN_EXPIRATION: z.coerce.number(),
    NEXT_PUBLIC_REFRESH_TOKEN_EXPIRATION: z.coerce.number(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_ACCESS_TOKEN_NAME: process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME,
    NEXT_PUBLIC_REFRESH_TOKEN_NAME: process.env.NEXT_PUBLIC_REFRESH_TOKEN_NAME,
    NEXT_PUBLIC_ACCESS_TOKEN_EXPIRATION:
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRATION,
    NEXT_PUBLIC_REFRESH_TOKEN_EXPIRATION:
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRATION,
  },
});
