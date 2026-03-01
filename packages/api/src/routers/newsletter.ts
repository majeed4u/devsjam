import prisma from "@devjams/db";
import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const newsletterRouter = {
	// Subscribe to newsletter (public)
	subscribe: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				source: z.string().optional().default("website"),
			}),
		)
		.handler(async ({ input }) => {
			// Check if already subscribed
			const existing = await prisma.newsletterSubscriber.findUnique({
				where: { email: input.email },
			});

			if (existing) {
				if (existing.active) {
					return {
						success: true,
						message: "You're already subscribed!",
						subscriber: existing,
					};
				}
				// Reactivate inactive subscription
				const subscriber = await prisma.newsletterSubscriber.update({
					where: { email: input.email },
					data: { active: true },
				});
				return {
					success: true,
					message: "Welcome back! You've been resubscribed.",
					subscriber,
				};
			}

			// Create new subscriber
			const subscriber = await prisma.newsletterSubscriber.create({
				data: {
					email: input.email,
					source: input.source,
				},
			});

			return {
				success: true,
				message: "Thanks for subscribing!",
				subscriber,
			};
		}),

	// Unsubscribe from newsletter (public)
	unsubscribe: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
			}),
		)
		.handler(async ({ input }) => {
			const subscriber = await prisma.newsletterSubscriber.findUnique({
				where: { email: input.email },
			});

			if (!subscriber) {
				return {
					success: true,
					message: "Email not found in our subscribers list.",
				};
			}

			await prisma.newsletterSubscriber.update({
				where: { email: input.email },
				data: { active: false },
			});

			return {
				success: true,
				message: "You've been unsubscribed successfully.",
			};
		}),

	// Get all subscribers (admin only)
	getSubscribers: protectedProcedure
		.input(
			z.object({
				activeOnly: z.boolean().optional().default(false),
				limit: z.number().optional().default(50),
				offset: z.number().optional().default(0),
			}),
		)
		.handler(async ({ input }) => {
			const where = input.activeOnly ? { active: true } : {};

			const [subscribers, total] = await Promise.all([
				prisma.newsletterSubscriber.findMany({
					where,
					take: input.limit,
					skip: input.offset,
					orderBy: { createdAt: "desc" },
				}),
				prisma.newsletterSubscriber.count({ where }),
			]);

			return {
				subscribers,
				total,
				hasMore: input.offset + subscribers.length < total,
			};
		}),

	// Get subscriber stats (admin only)
	getStats: protectedProcedure.handler(async () => {
		const [total, active, inactive, recent] = await Promise.all([
			prisma.newsletterSubscriber.count(),
			prisma.newsletterSubscriber.count({ where: { active: true } }),
			prisma.newsletterSubscriber.count({ where: { active: false } }),
			prisma.newsletterSubscriber.count({
				where: {
					createdAt: {
						gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
					},
				},
			}),
		]);

		return {
			total,
			active,
			inactive,
			recent,
		};
	}),

	// Delete subscriber (admin only)
	deleteSubscriber: protectedProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input }) => {
			await prisma.newsletterSubscriber.delete({
				where: { id: input.id },
			});

			return { success: true };
		}),
};

export type NewsletterRouter = typeof newsletterRouter;
export type NewsletterRouterClient = RouterClient<typeof newsletterRouter>;
