// Local type definitions mirroring the Prisma schema
// These are used by the frontend components and match the API response shapes

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  published: boolean;
  readingTime: number | null;
  views: number;
  category: Category | null;
  categoryId: string | null;
  tags: PostTag[];
  author: User | null;
  authorId: string | null;
  series: Series | null;
  seriesId: string | null;
  seriesOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostTag {
  id: string;
  name: string;
  slug: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}
