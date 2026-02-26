/**
 * Post type that matches the shape returned by oRPC's getPosts endpoint
 * This is derived from the actual API response, not the Prisma model
 */

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  archived: boolean;
  readingTime: number | null;
  views: number;
  authorId: string;
  categoryId: string | null;
  seriesId: string | null;
  seriesOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations - these are always returned by oRPC but typed as optional for component flexibility
  category?: Category | null;
  series?: Series | null;
  tags?: Tag[];
}
