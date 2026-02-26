import z from "zod";

export const postCreateSchema = z
  .object({
    title: z.string().min(5),
    excerpt: z.string().min(20).optional(),
    content: z.string().min(100),
    coverImage: z.string().url().optional().or(z.literal("")),
    published: z.boolean().default(false).optional(),
    readingTime: z.number().optional(),
    views: z.number().default(0).optional(),
    categoryId: z.string(),
    seriesId: z.string().optional(),
    tags: z.array(z.string()),
    seriesOrder: z.number().optional(),
  })
  .refine((data) => !data.seriesOrder || !!data.seriesId, {
    message: "seriesOrder requires a seriesId",
    path: ["seriesOrder"],
  });

export type PostCreateInput = z.infer<typeof postCreateSchema>;

export type PostCardType = {
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  readingTime: number | null;
  views: number;
  authorId: string;
  categoryId: string | null;
  seriesId: string | null;
  seriesOrder: number | null;
};
