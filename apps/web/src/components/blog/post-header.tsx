import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Post } from "@/types/post";

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingTime = post.readingTime || 5;

  return (
    <header className="space-y-6 pb-8 border-b">
      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {post.category && (
          <Badge variant="secondary" className="text-xs font-medium">
            {post.category.name}
          </Badge>
        )}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.createdAt?.toISOString()}>
            {formatDate(post.createdAt || new Date())}
          </time>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {post.title}
      </h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-xl text-muted-foreground max-w-3xl">
          {post.excerpt}
        </p>
      )}

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

      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <Separator />
    </header>
  );
}
