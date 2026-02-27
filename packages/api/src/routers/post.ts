import prisma from "@devjams/db";
import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { cacheDeletePattern, cacheGet, cacheSet } from "../lib/cache";
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

/**
 * Transform post with computed fields for frontend
 * Moves frontend processing to backend for better performance
 */
function transformPost<T extends {
  tags: { tag: { id: string; name: string; slug: string } }[];
  createdAt: string | Date;
  slug: string | null;
  title: string;
}>(post: T) {
  return {
    ...post,
    tags: post.tags.map((t) => t.tag),
    // Computed fields - move frontend processing to backend
    formattedDate: new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    slugUrl: post.slug || post.title.toLowerCase().replace(/\s+/g, "-"),
  };
}

export const postRouter = {
  getPosts: publicProcedure.handler(async () => {
    // Try cache first
    const cacheKey = "posts:published";
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    // Cache miss - fetch from database
    const posts = await prisma.post.findMany({
      where: { published: true, archived: false },
      include: postInclude,
    });

    const result = mapPosts(posts).map(transformPost);
    await cacheSet(cacheKey, result, 300); // 5 minutes cache
    return result;
  }),

  getPostsForAdmin: protectedProcedure.handler(async () => {
    const posts = await prisma.post.findMany({
      include: postInclude,
    });
    return mapPosts(posts);
  }),

  // Get single post by slug with caching
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .handler(async ({ input }) => {
      const cacheKey = `post:slug:${input.slug}`;
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

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

      const result = transformPost(post);
      await cacheSet(cacheKey, result, 600); // 10 minutes cache
      return result;
    }),

  // Get metadata for filters (categories, tags, series) with post counts
  getMetadata: publicProcedure.handler(async () => {
    const cacheKey = "posts:metadata";
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const [categories, tags, series] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { posts: true } },
        },
      }),
      prisma.tag.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { posts: true } },
        },
      }),
      prisma.series.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          _count: { select: { posts: true } },
        },
      }),
    ]);

    const result = { categories, tags, series };
    await cacheSet(cacheKey, result, 600); // 10 minutes cache
    return result;
  }),

  // Get series navigation (prev/next post in series)
  getSeriesNavigation: publicProcedure
    .input(z.object({ postId: z.string() }))
    .handler(async ({ input }) => {
      const cacheKey = `series:nav:${input.postId}`;
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const post = await prisma.post.findUnique({
        where: { id: input.postId },
        select: { seriesId: true, seriesOrder: true },
      });

      if (!post?.seriesId) {
        return null;
      }

      const [prev, next] = await Promise.all([
        prisma.post.findFirst({
          where: {
            seriesId: post.seriesId,
            seriesOrder: { lt: post.seriesOrder ?? 0 },
            published: true,
            archived: false,
          },
          orderBy: { seriesOrder: "desc" },
          select: { id: true, title: true, slug: true },
        }),
        prisma.post.findFirst({
          where: {
            seriesId: post.seriesId,
            seriesOrder: { gt: post.seriesOrder ?? 0 },
            published: true,
            archived: false,
          },
          orderBy: { seriesOrder: "asc" },
          select: { id: true, title: true, slug: true },
        }),
      ]);

      const result = { prev, next };
      await cacheSet(cacheKey, result, 300); // 5 minutes cache
      return result;
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

      // Invalidate cache when post is created
      await cacheDeletePattern("posts:");
      await cacheDeletePattern("post:");

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

      // Invalidate cache when post is updated
      await cacheDeletePattern("posts:");
      await cacheDeletePattern("post:");

      return { ...post, tags: post.tags.map((t) => t.tag) };
    }),
};

export type PostRouter = typeof postRouter;
export type PostRouterClient = RouterClient<typeof postRouter>;
