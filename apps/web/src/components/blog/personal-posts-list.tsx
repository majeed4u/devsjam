import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
      month: "short",
      day: "numeric",
    });
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Title */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-xs font-sans font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Posts */}
        <div className="flex flex-col">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group cursor-pointer border-b border-border last:border-b-0"
            >
              <div className="flex flex-col gap-3 py-8 md:flex-row md:items-start md:gap-8">
                {/* Date column */}
                <div className="flex items-center gap-3 md:w-40 md:flex-shrink-0">
                  <time
                    dateTime={post.createdAt?.toISOString()}
                    className="text-sm font-mono text-muted-foreground tabular-nums"
                  >
                    {formatDate(post.createdAt || new Date())}
                  </time>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{post.readingTime || 5}m</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {post.category && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-sans font-medium rounded-md"
                      >
                        {post.category.name}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-serif font-semibold tracking-tight text-foreground leading-snug group-hover:text-muted-foreground transition-colors duration-200">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed font-sans line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag: any) => (
                        <span
                          key={tag.id}
                          className="text-xs text-muted-foreground font-mono"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="hidden md:flex md:items-center md:self-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
