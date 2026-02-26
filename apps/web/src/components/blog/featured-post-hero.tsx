import { Link } from "@tanstack/react-router";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/post";

interface FeaturedPostHeroProps {
  post: Post;
}

export function FeaturedPostHero({ post }: FeaturedPostHeroProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingTime = post.readingTime || 5;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border">
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <div className="flex flex-col gap-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3">
            {post.category && (
              <Badge variant="secondary" className="text-xs font-medium">
                {post.category.name}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.createdAt?.toISOString()}>
                {formatDate(post.createdAt || new Date())}
              </time>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/blog/${post.slug}`} className="group">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl group-hover:text-primary transition-colors">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground max-w-3xl line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* CTA */}
          <Link to={`/blog/${post.slug}`}>
            <Button size="lg" className="group">
              Read Article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
}
