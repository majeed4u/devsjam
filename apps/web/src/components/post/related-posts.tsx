import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Post } from "../../../../packages/db/prisma/generated/client";

interface RelatedPostsProps {
  posts: (Post & {
    category?: { id: string; name: string };
    tags?: Array<{ id: string; name: string; slug: string }>;
  })[];
  limit?: number;
}

export function RelatedPosts({ posts, limit = 3 }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, limit);

  return (
    <section className="py-12">
      <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {displayPosts.map((post) => {
          const slug =
            post.slug || post.title.toLowerCase().replace(/\s+/g, "-");
          return (
            <Link
              key={post.id}
              to={`/blog/${slug}`}
              className="group rounded-lg border border-border/40 hover:border-primary/30 transition-all duration-300 p-6 bg-card/50 hover:bg-card/80"
            >
              <div className="space-y-3">
                {post.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {post.category.name}
                  </span>
                )}
                <h4 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-foreground/60 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm pt-2">
                  Read More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
