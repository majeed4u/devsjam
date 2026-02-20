import { createContext } from "@devjams/api/context";
import { appRouter } from "@devjams/api/routers/index";
import { auth } from "@devjams/auth";
import { env } from "@devjams/env/server";
import { cors } from "@elysiajs/cors";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { healthcheckPlugin } from "elysia-healthcheck";
import { sentry } from "elysiajs-sentry";
import logixlysia from "logixlysia";
const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});
const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const app = new Elysia()

  .use(
    cors({
      origin: [env.CORS_ORIGIN],
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(healthcheckPlugin())
  .use(rateLimit())
  .use(sentry())
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: "simple",
        timestamp: {
          translateTime: "yyyy-mm-dd HH:MM:ss.SSS",
        },
        logFilePath: "./logs/example.log",
        ip: true,
        customLogFormat:
          "🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}",
      },
    }),
  )
  .all("/api/auth/*", async (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      return auth.handler(request);
    }
    return status(405);
  })
  .all("/rpc*", async (context) => {
    const { response } = await rpcHandler.handle(context.request, {
      prefix: "/rpc",
      context: await createContext({ context }),
    });
    return response ?? new Response("Not Found", { status: 404 });
  })
  .all("/api*", async (context) => {
    const { response } = await apiHandler.handle(context.request, {
      prefix: "/api-reference",
      context: await createContext({ context }),
    });
    return response ?? new Response("Not Found", { status: 404 });
  })
  .get("/", () => "OK");
app.listen({
  port: 3000,
  hostname: "0.0.0.0",
});
