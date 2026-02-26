import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Post } from "../../../../packages/db/prisma/generated/client";

interface PersonalFeaturedPostProps {
  post: Post;
}

export function PersonalFeaturedPost({ post }: PersonalFeaturedPostProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingTime = post.readingTime || 5;

  return (
    <section className="py-12 border-t border-b">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Label */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary">
              Featured Post
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.category && (
              <Badge variant="secondary" className="text-xs font-medium">
                {post.category.name}
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.createdAt?.toISOString()}>
                {formatDate(post.createdAt || new Date())}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* CTA */}
          <Button size="lg" className="group">
            Read Article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
