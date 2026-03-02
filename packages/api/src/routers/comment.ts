import prisma from "@devjams/db";
import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

const commentInclude = {
	author: {
		select: {
			id: true,
			name: true,
			image: true,
		},
	},
} as const;

export const commentRouter = {
	// Get all comments for admin (protected)
	getAllForAdmin: protectedProcedure.handler(async () => {
		const comments = await prisma.comment.findMany({
			include: {
				...commentInclude,
				post: {
					select: {
						id: true,
						title: true,
						slug: true,
					},
				},
				replies: {
					include: commentInclude,
					orderBy: { createdAt: "asc" },
				},
			},
			orderBy: { createdAt: "desc" },
		});

		// Filter to only top-level comments (no parent)
		const topLevelComments = comments.filter((c) => !c.parentId);

		return topLevelComments;
	}),

	// Get all comments for a post (public)
	getByPost: publicProcedure
		.input(z.object({ postId: z.string() }))
		.handler(async ({ input }) => {
			const comments = await prisma.comment.findMany({
				where: {
					postId: input.postId,
				},
				include: {
					...commentInclude,
					replies: {
						include: commentInclude,
						orderBy: { createdAt: "asc" },
					},
				},
				orderBy: { createdAt: "desc" },
			});

			// Filter to only top-level comments (no parent)
			const topLevelComments = comments.filter((c) => !c.parentId);

			return topLevelComments;
		}),

	// Create a new comment (authenticated)
	create: protectedProcedure
		.input(
			z.object({
				postId: z.string(),
				content: z.string().min(1).max(5000),
				parentId: z.string().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const comment = await prisma.comment.create({
				data: {
					content: input.content,
					postId: input.postId,
					authorId: context.session.user.id,
					parentId: input.parentId,
				},
				include: commentInclude,
			});

			return comment;
		}),

	// Update a comment (author only)
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				content: z.string().min(1).max(5000),
			}),
		)
		.handler(async ({ context, input }) => {
			// First check if user owns this comment
			const existingComment = await prisma.comment.findUnique({
				where: { id: input.id },
			});

			if (!existingComment) {
				throw new Error("Comment not found");
			}

			if (existingComment.authorId !== context.session.user.id) {
				throw new Error("You can only edit your own comments");
			}

			const comment = await prisma.comment.update({
				where: { id: input.id },
				data: { content: input.content },
				include: commentInclude,
			});

			return comment;
		}),

	// Delete a comment (author or admin only)
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			// First check if user owns this comment or is admin
			const existingComment = await prisma.comment.findUnique({
				where: { id: input.id },
			});

			if (!existingComment) {
				throw new Error("Comment not found");
			}

			const isAdmin = context.session.user.role === "admin";
			const isAuthor = existingComment.authorId === context.session.user.id;

			if (!isAuthor && !isAdmin) {
				throw new Error("You can only delete your own comments");
			}

			await prisma.comment.delete({
				where: { id: input.id },
			});

			return { success: true };
		}),

	// Get comment count for a post (public)
	getCount: publicProcedure
		.input(z.object({ postId: z.string() }))
		.handler(async ({ input }) => {
			const count = await prisma.comment.count({
				where: { postId: input.postId },
			});

			return { count };
		}),
};

export type CommentRouter = typeof commentRouter;
export type CommentRouterClient = RouterClient<typeof commentRouter>;
