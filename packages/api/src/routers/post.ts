import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../index";
import { postCreateSchema } from "../lib/types";
import prisma from "@devjams/db";
import { generateUniqueSlug } from "../lib/generateUniqueSlug";

export const postRouter = {
  getPosts: publicProcedure.handler(() => {
    return prisma.post.findMany();
  }),
  create: protectedProcedure
    .input(postCreateSchema)
    .handler(async ({ context, input }) => {
      const slug = await generateUniqueSlug(input.title);
      const posts = await prisma.post.create({
        data: {
          title: input.title,
          slug,
          excerpt: input.excerpt,
          content: input.content,
          coverImage: input.coverImage,
          published: input.published,
          readingTime: input.readingTime,
          views: input.views,
          categoryId: input.categoryId,
          seriesId: input.seriesId,
          tags: {
            create:
              input.tags?.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { slug: tag },
                    create: { name: tag, slug: tag },
                  },
                },
              })) ?? [],
          },
          seriesOrder: input.seriesOrder,
          authorId: context.session?.user.id!,
        },
      });
      return posts;
    }),
};

export type PostRouter = typeof postRouter;
export type PostRouterClient = RouterClient<typeof postRouter>;
