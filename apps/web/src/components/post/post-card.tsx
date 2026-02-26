import { Link } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";
import type { PostTypeAll } from "./types";

interface PostCardProps {
  post: PostTypeAll;
}

export function PostCard({ post }: PostCardProps) {
  const publishDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, "-");
  const categoryName = post.category?.name;

  return (
    <article className="group rounded-lg border border-border/30 bg-transparent p-5 transition-colors hover:border-border hover:bg-muted/30 sm:p-6">

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {post.series && (
              <Link
                to="/blog/series/$series"
                params={{ series: post.series.slug }}
                className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground/70 text-xs hover:bg-muted/80"
              >
                Series: {post.series.title}
              </Link>
            )}
            {categoryName && (
              <Link
                to="/blog/category/$category"
                params={{ category: categoryName }}
                className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary text-xs transition-colors duration-200 hover:bg-primary/20"
              >
                {categoryName}
              </Link>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <Link
                    key={tag.id}
                    to="/blog/tag/$tag"
                    params={{ tag: tag.name }}
                    className="rounded-full bg-accent/50 px-2.5 py-1 font-medium text-foreground/70 text-xs transition-colors duration-200 hover:bg-accent"
                  >
                    {tag.name}
                  </Link>
                ))}
                {post.tags.length > 2 && (
                  <span className="rounded-full bg-accent/50 px-2.5 py-1 font-medium text-foreground/70 text-xs">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          <h3 className="font-semibold text-xl text-foreground sm:text-2xl">
            {post.title}
          </h3>

          <p className="text-base text-foreground/60 leading-relaxed sm:text-lg">
            {post.excerpt}
          </p>
        </div>

        {/* Cover Image Preview */}
        {post.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border/30 bg-accent/30">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Footer Meta */}
        <div className="flex flex-col gap-4 border-border/30 border-t pt-2">
          <div className="flex flex-wrap items-center gap-4 text-foreground/60 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          <Link
            to="/blog/$slug"
            params={{ slug }}
            className="text-foreground/70 text-sm hover:text-foreground hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
