import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { categoryRouter } from "./category";
import { postRouter } from "./post";
import { seriesRouter } from "./series";
import { tagRouter } from "./tags";
import { uploadRouter } from "./upload";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	post: postRouter,
	upload: uploadRouter,
	category: categoryRouter,
	series: seriesRouter,
	tag: tagRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
