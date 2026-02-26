import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PostTypeAll } from "./types";

interface BlogSidebarProps {
  relatedPosts: PostTypeAll[];
  currentPostTags?: Array<{ id: string; name: string }>;
  currentPostCategory?: { id: string; name: string } | null;
  currentPostSeries?: { id: string; title: string; slug: string } | null;
  allTags?: Array<{ id: string; name: string; _count?: { posts: number } }>;
  allCategories?: Array<{
    id: string;
    name: string;
    _count?: { posts: number };
  }>;
  allSeries?: Array<{
    id: string;
    title: string;
    slug: string;
    _count?: { posts: number };
  }>;
}

export function BlogSidebar({
  relatedPosts,
  currentPostTags = [],
  currentPostCategory,
  currentPostSeries,
  allTags = [],
  allCategories = [],
  allSeries = [],
}: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div>
          <h3 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">
            Related Posts
          </h3>
          <ul className="space-y-3">
            {relatedPosts.slice(0, 5).map((post) => {
              const slug =
                post.slug || post.title.toLowerCase().replace(/\s+/g, "-");
              return (
                <li key={post.id}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug }}
                    className="group block"
                  >
                    <h4 className="font-medium text-foreground text-sm transition-colors duration-200 group-hover:text-primary">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 text-foreground/60 text-xs">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {relatedPosts.length > 0 &&
        (allTags.length > 0 ||
          allCategories.length > 0 ||
          allSeries.length > 0) && <Separator />}

      {/* Filter by Tags */}
      {allTags.length > 0 && (
        <div>
          <h3 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">
            Filter by Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isActive = currentPostTags?.some((t) => t.id === tag.id);
              return (
                <Link
                  key={tag.id}
                  to="/blog/tag/$tag"
                  params={{ tag: tag.name }}
                  className={`rounded-full px-3 py-1.5 font-medium text-xs transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent/50 text-foreground/70 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {tag.name}
                  {tag._count?.posts && (
                    <span className="ml-1 opacity-60">
                      ({tag._count.posts})
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter by Category */}
      {allCategories.length > 0 && (
        <div>
          <h3 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">
            Filter by Category
          </h3>
          <ul className="space-y-2">
            {allCategories.map((category) => {
              const isActive = currentPostCategory?.id === category.id;
              return (
                <li key={category.id}>
                  <Link
                    to="/blog/category/$category"
                    params={{ category: category.name }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <span>{category.name}</span>
                    {category._count?.posts && (
                      <span className="rounded-full bg-background/50 px-2 py-0.5 text-xs opacity-60">
                        {category._count.posts}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Filter by Series */}
      {allSeries.length > 0 && (
        <div>
          <h3 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">
            Filter by Series
          </h3>
          <ul className="space-y-2">
            {allSeries.map((series) => {
              const isActive = currentPostSeries?.id === series.id;
              return (
                <li key={series.id}>
                  <Link
                    to="/blog/series/$series"
                    params={{ series: series.slug }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <span>{series.title}</span>
                    {series._count?.posts && (
                      <span className="rounded-full bg-background/50 px-2 py-0.5 text-xs opacity-60">
                        {series._count.posts}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
