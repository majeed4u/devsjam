import prisma from "@devjams/db";
import { env } from "@devjams/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [],
});
