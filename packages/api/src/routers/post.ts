import prisma from "@devjams/db";
import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { calculateReadingTime } from "../lib/calculateReadingTime";
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

  // New: Get single post by slug - much more efficient than fetching all posts
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .handler(async ({ input }) => {
      const post = await prisma.post.findFirst({
        where: {
          slug: input.slug,
          published: true,
          archived: false,
        },
        include: postInclude,
      });

      if (!post) {
        throw new Error("Post not found");
      }

      return { ...post, tags: post.tags.map((t) => t.tag) };
    }),

  create: protectedProcedure
    .input(postCreateSchema)
    .handler(async ({ context, input }) => {
      const slug = await generateUniqueSlug(input.title);
      // Auto-calculate reading time from content
      const readingTime = calculateReadingTime(input.content || "");

      const posts = await prisma.post.create({
        data: {
          title: input.title,
          slug,
          excerpt: input.excerpt,
          content: input.content,
          coverImage: input.coverImage,
          published: input.published,
          readingTime, // Auto-calculated
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
      if (data.content !== undefined) {
        updateData.content = data.content;
        // Auto-recalculate reading time when content changes
        updateData.readingTime = calculateReadingTime(data.content || "");
      }
      if (data.coverImage !== undefined)
        updateData.coverImage = data.coverImage;
      if (data.published !== undefined) updateData.published = data.published;
      if (data.archived !== undefined) updateData.archived = data.archived;
      // Note: readingTime is auto-calculated from content, ignore if explicitly provided
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

  // Full-text search across posts
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(2),
        limit: z.number().min(1).max(50).optional().default(10),
      }),
    )
    .handler(async ({ input }) => {
      const { query, limit } = input;

      // Simple ILIKE search (works without full-text search setup)
      const posts = await prisma.post.findMany({
        where: {
          published: true,
          archived: false,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: postInclude,
        take: limit,
      });

      return {
        results: mapPosts(posts),
        method: "ilike",
      };
    }),
};

export type PostRouter = typeof postRouter;
export type PostRouterClient = RouterClient<typeof postRouter>;
