import { Link } from "@tanstack/react-router";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Post } from "@/types/post";

interface RelatedPostsProps {
  posts: Post[];
  title?: string;
}

export function RelatedPosts({
  posts,
  title = "Related Posts",
}: RelatedPostsProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="my-12 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-border/50 hover:border-border"
          >
            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            <CardHeader className="flex-1 space-y-3 pb-4">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2">
                {post.category && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {post.category.name}
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={post.createdAt?.toISOString()}>
                    {formatDate(post.createdAt || new Date())}
                  </time>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime || 5} min</span>
                </div>
              </div>

              {/* Title */}
              <div className="group/link cursor-pointer">
                <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover/link:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </div>

              {/* Excerpt */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            </CardHeader>

            <CardFooter className="pt-0">
              <div className="flex items-center gap-1 text-sm font-medium text-primary cursor-pointer hover:underline">
                Read
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
