import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../index";
import prisma from "@devjams/db";
import z from "zod";

export const categoryRouter = {
  gets: publicProcedure.handler(async () => {
    const categories = await prisma.category.findMany();
    return categories;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
      }),
    )
    .handler(async ({ input }) => {
      const category = await prisma.category.create({
        data: {
          name: input.name,
          slug: input.name.toLowerCase().replace(/\s+/g, "-"),
        },
      });
      return category;
    }),
};

export type CategoryRouter = typeof categoryRouter;
export type CategoryRouterClient = RouterClient<typeof categoryRouter>;
