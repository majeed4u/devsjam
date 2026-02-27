import { Link, useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { SearchInput } from "@/components/search/search-input";
import { PostCard } from "@/components/post/post-card";

export const Route = createFileRoute("/search/")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
      category: (search.category as string) || "",
      tags: ((search.tags as string)?.split(",").filter(Boolean) || []) as string[],
      series: (search.series as string) || "",
    };
  },
});

function SearchPage() {
  const { q: query, category, tags, series } = Route.useSearch();
  const navigate = useNavigate();

  const hasFilters = Boolean(query || category || (tags && tags.length > 0) || series);

  const { data: searchResults, isLoading, isError } = useQuery(
    orpc.post.search.queryOptions({
      input: {
        query,
        categoryId: category || undefined,
        tagIds: tags && tags.length > 0 ? tags : undefined,
        seriesId: series || undefined,
        limit: 20,
      },
    }),
  );

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="font-semibold text-3xl text-foreground sm:text-4xl">
            Search
          </h1>
          <p className="mt-2 text-foreground/60 text-sm">
            Find articles by title, content, or tags
          </p>
        </header>

        {/* Search Input */}
        <div className="mb-10">
          <SearchInput placeholder="Search for articles..." />
        </div>

        {/* Results */}
        {!hasFilters ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-foreground/20 mb-4" />
            <h2 className="font-semibold text-xl text-foreground mb-2">
              Start Searching
            </h2>
            <p className="text-foreground/60 text-sm">
              Enter a keyword, or select filters to search through blog posts
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : isError || !searchResults?.results ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-foreground/20 mb-4" />
            <h2 className="font-semibold text-xl text-foreground mb-2">
              No Results Found
            </h2>
            <p className="text-foreground/60 text-sm">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 border-border/30 border-b pb-4">
              <p className="text-foreground/60 text-sm">
                Found <span className="font-semibold text-foreground">
                  {searchResults.total}
                </span>{" "}
                result{searchResults.total !== 1 ? "s" : ""}{" "}
                {query && (
                  <>for "<span className="font-semibold text-foreground">"{query}"</span></>
                )}
                {(category || tags || series) && (
                  <span className="ml-2 text-xs text-foreground/40">
                    with filters
                  </span>
                )}
              </p>
            </div>

            {/* Results List */}
            <div className="space-y-8">
              {searchResults.results.map((post: any) => (
                <article
                  key={post.id}
                  className="rounded-lg border border-border/30 bg-transparent p-6 transition-colors hover:border-border hover:bg-muted/30"
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug || post.id }}
                    className="block"
                  >
                    <h3 className="font-semibold text-xl text-foreground mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-foreground/60 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
