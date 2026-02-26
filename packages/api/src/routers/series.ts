import prisma from "@devjams/db";
import type { RouterClient } from "@orpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const seriesRouter = {
	gets: publicProcedure.handler(async () => {
		const series = await prisma.series.findMany();
		return series;
	}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(255),
			}),
		)
		.handler(async ({ input }) => {
			const series = await prisma.series.create({
				data: {
					title: input.name,
					slug: input.name.toLowerCase().replace(/\s+/g, "-"),
				},
			});
			return series;
		}),
};

export type SeriesRouter = typeof seriesRouter;
export type SeriesRouterClient = RouterClient<typeof seriesRouter>;
