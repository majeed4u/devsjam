import prisma from "@devjams/db";
import type { RouterClient } from "@orpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const tagRouter = {
	gets: publicProcedure.handler(async () => {
		const tags = await prisma.tag.findMany();
		return tags;
	}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(255),
			}),
		)
		.handler(async ({ input }) => {
			const tags = await prisma.tag.create({
				data: {
					name: input.name,
					slug: input.name.toLowerCase().replace(/\s+/g, "-"),
				},
			});
			return tags;
		}),
};

export type TagRouter = typeof tagRouter;
export type TagsRouterClient = RouterClient<typeof tagRouter>;
