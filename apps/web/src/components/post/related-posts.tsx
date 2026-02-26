import { Link } from "@tanstack/react-router";
import type { Post } from "@/types/post";
import type { PostTypeAll } from "./types";

interface RelatedPostsProps {
  posts: PostTypeAll[];
  limit?: number;
}

export function RelatedPosts({ posts, limit = 3 }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, limit);

  return (
    <section>
      <h3 className="mb-4 font-medium text-foreground/80 text-sm uppercase tracking-wider">
        Related posts
      </h3>
      <ul className="space-y-3">
        {displayPosts.map((post) => {
          const slug =
            post.slug || post.title.toLowerCase().replace(/\s+/g, "-");
          return (
            <li key={post.id}>
              <Link
                to="/blog/$slug"
                params={{ slug }}
                className="text-foreground/70 text-sm hover:text-foreground hover:underline"
              >
                {post.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
