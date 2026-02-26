import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Post } from "@/types/post";

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
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-muted-foreground">
            Featured
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group cursor-pointer"
        >
          <div className="flex flex-col gap-8 md:flex-row md:gap-12 md:items-start">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="md:w-1/2 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}

            {/* Content */}
            <div className={`flex flex-col gap-5 ${post.coverImage ? "md:w-1/2" : "w-full"}`}>
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3">
                {post.category && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-sans font-medium rounded-md"
                  >
                    {post.category.name}
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={post.createdAt?.toISOString()}>
                    {formatDate(post.createdAt || new Date())}
                  </time>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-serif font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl leading-[1.15] text-balance group-hover:text-muted-foreground transition-colors duration-200">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-base text-muted-foreground leading-relaxed font-sans line-clamp-3">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
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

              {/* CTA */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-foreground group-hover:gap-3 transition-all duration-200">
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
