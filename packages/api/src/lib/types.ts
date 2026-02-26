import z from "zod";

export const postCreateSchema = z.object({
	title: z.string().min(5),
	excerpt: z.string().min(20).optional(),
	content: z.string().min(100),
	coverImage: z.url().optional().or(z.literal("")),
	published: z.boolean().default(false),
	readingTime: z.number().optional(),
	views: z.number().default(0),
	categoryId: z.string(),
	seriesId: z.string().optional(),
	tags: z.array(z.string()),
	seriesOrder: z.number().optional(),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;
