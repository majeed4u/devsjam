import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Post } from "../../../../packages/db/prisma/generated/client";

interface PersonalPostsListProps {
  posts: Post[];
  title?: string;
}

export function PersonalPostsList({
  posts,
  title = "Latest Posts",
}: PersonalPostsListProps) {
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
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Section Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <div className="mt-4 h-px w-24 bg-border" />
          </div>

          {/* Posts List */}
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <div className="space-y-3">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {post.category && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
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
                      <span>{post.readingTime || 5} min read</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: any) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
