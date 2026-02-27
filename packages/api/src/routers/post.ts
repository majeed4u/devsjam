import prisma from "@devjams/db";
import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../index";
import { generateUniqueSlug } from "../lib/generateUniqueSlug";
import { postCreateSchema, postUpdateSchema } from "../lib/types";

const postInclude = {
  category: { select: { id: true, name: true, slug: true } },
  series: { select: { id: true, title: true, slug: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
} as const;

function mapPosts<
  T extends { tags: { tag: { id: string; name: string; slug: string } }[] },
>(posts: T[]) {
  return posts.map((p) => ({
    ...p,
    tags: p.tags.map((t) => t.tag),
  }));
}

export const postRouter = {
  getPosts: publicProcedure.handler(async () => {
    const posts = await prisma.post.findMany({
      where: { published: true, archived: false },
      include: postInclude,
    });
    return mapPosts(posts);
  }),

  getPostsForAdmin: protectedProcedure.handler(async () => {
    const posts = await prisma.post.findMany({
      include: postInclude,
    });
    return mapPosts(posts);
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

  update: protectedProcedure
    .input(postUpdateSchema)
    .handler(async ({ input }) => {
      const { id, ...data } = input;

      // Handle tags separately - need to update the PostTag relations
      const updateData: any = {};

      // Only include fields that are provided
      if (data.title !== undefined) updateData.title = data.title;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.coverImage !== undefined)
        updateData.coverImage = data.coverImage;
      if (data.published !== undefined) updateData.published = data.published;
      if (data.archived !== undefined) updateData.archived = data.archived;
      if (data.readingTime !== undefined)
        updateData.readingTime = data.readingTime;
      if (data.views !== undefined) updateData.views = data.views;
      if (data.categoryId !== undefined)
        updateData.categoryId = data.categoryId;
      if (data.seriesId !== undefined) updateData.seriesId = data.seriesId;
      if (data.seriesOrder !== undefined)
        updateData.seriesOrder = data.seriesOrder;

      // Handle tags - delete existing and create new ones
      if (data.tags !== undefined) {
        // Delete existing PostTag relations
        await prisma.postTag.deleteMany({
          where: { postId: id },
        });

        // Create new PostTag relations
        updateData.tags = {
          create: data.tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { slug: tag },
                create: { name: tag, slug: tag },
              },
            },
          })),
        };
      }

      const post = await prisma.post.update({
        where: { id },
        data: updateData,
        include: postInclude,
      });
      return { ...post, tags: post.tags.map((t) => t.tag) };
    }),
};

export type PostRouter = typeof postRouter;
export type PostRouterClient = RouterClient<typeof postRouter>;
