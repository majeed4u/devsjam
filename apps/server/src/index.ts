import { logger } from "@chneau/elysia-logger";
import { createContext } from "@devjams/api/context";
import { getFile } from "@devjams/api/lib/s3-helper";
import { appRouter } from "@devjams/api/routers/index";
import { auth } from "@devjams/auth";
import { env } from "@devjams/env/server";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Elysia } from "elysia";
import { healthcheckPlugin } from "elysia-healthcheck";
import { sentry } from "elysiajs-sentry";

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
  .use(openapi())
  .use(serverTiming())

  .use(healthcheckPlugin())
  .use(sentry())
  .use(
    cors({
      origin: [env.CORS_ORIGIN],
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
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
  .get("/media/:path*", async ({ params, status }) => {
    try {
      const key = params["path*"];
      console.log("Media request for key:", key);
      const { buffer, contentType } = await getFile(key);
      console.log(
        "Successfully fetched file:",
        key,
        "contentType:",
        contentType,
      );
      return new Response(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("Error fetching media file:", error);
      return status(404);
    }
  })
  .get("/", () => "OK - DevJams - Server")
  .use(logger())
  .listen(
    {
      port: 3000,
      hostname: "0.0.0.0",
    },
    () => console.log("server running on http://0.0.0.0:3000"),
  );
