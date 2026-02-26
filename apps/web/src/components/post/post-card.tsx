import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import type { Post } from "../../../../packages/db/prisma/generated/client";

interface PostCardProps {
  post: Post & {
    category?: { id: string; name: string };
    tags?: Array<{ id: string; name: string; slug: string }>;
  };
}

export function PostCard({ post }: PostCardProps) {
  const publishDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 p-6 sm:p-8 bg-card/50 hover:bg-card/80">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            {post.category && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {post.category.name}
              </span>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/50 text-foreground/70"
                  >
                    {tag.name}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/50 text-foreground/70">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-foreground/60 text-base sm:text-lg leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Cover Image Preview */}
        {post.coverImage && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-accent/30 border border-border/30">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Footer Meta */}
        <div className="flex flex-col gap-4 pt-2 border-t border-border/30">
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {/* Read More Link */}
          <Link
            to={`/blog/${slug}`}
            className="inline-flex items-center gap-2 text-primary font-medium group/link"
          >
            Read Article
            <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}
