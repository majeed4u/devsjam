import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    RUSTFS_REGION: z.string().min(1),
    RUSTFS_ACCESS_KEY_ID: z.string().min(1),
    RUSTFS_SECRET_ACCESS_KEY: z.string().min(1),
    RUSTFS_S3_BUCKET: z.string().min(1),
    RUSTFS_ENDPOINT_URL: z.url().optional(),
    SERVER_URL: z.url().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
