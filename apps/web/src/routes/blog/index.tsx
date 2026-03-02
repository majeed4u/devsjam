import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { PostCard } from "@/components/post/post-card";
import { PostCardGridSkeleton } from "@/components/skeletons/post-card-skeleton";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/blog/")({
  component: BlogComponent,
});

function BlogComponent() {
  const [page, setPage] = useQueryState("page", {
		defaultValue: 1,
		parse: (value) => (value ? parseInt(value, 10) : 1),
		serialize: (value) => value.toString(),
	});

	const POSTS_PER_PAGE = 6;

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery(orpc.post.getPosts.queryOptions());

	// Calculate pagination
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
	const currentPagePosts = useMemo(() => {
		const startIndex = (page - 1) * POSTS_PER_PAGE;
		const endIndex = startIndex + POSTS_PER_PAGE;
		return posts.slice(startIndex, endIndex);
	}, [posts, page]);

  const { categories, tags, series } = useMemo(() => {
    const catMap = new Map<string, { name: string; slug: string }>();
    const tagMap = new Map<string, { name: string; slug: string }>();
    const seriesMap = new Map<string, { title: string; slug: string }>();
    for (const p of posts) {
      if (p.category)
        catMap.set(p.category.id, {
          name: p.category.name,
          slug: p.category.slug,
        });
      for (const t of p.tags ?? [])
        tagMap.set(t.id, { name: t.name, slug: t.slug });
      if (p.series)
        seriesMap.set(p.series.id, {
          title: p.series.title,
          slug: p.series.slug,
        });
    }
    return {
      categories: Array.from(catMap.values()),
      tags: Array.from(tagMap.values()),
      series: Array.from(seriesMap.values()),
    };
  }, [posts]);

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="mb-8">
          <h1 className="font-semibold text-2xl text-foreground sm:text-3xl">
            Blog
          </h1>
          <p className="mt-1 text-foreground/60 text-sm">
            DevOps, infrastructure, CI/CD, and reliability — notes and how-tos.
          </p>
        </header>

        {/* Filters by category, tag, series */}
        <nav
          className="mb-10 border-border/30 border-b pb-6"
          aria-label="Filter posts"
        >
          <p className="mb-3 text-foreground/60 text-xs uppercase tracking-wider">
            Filter by
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {categories.length > 0 && (
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-foreground/50">Category:</span>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/blog/category/$category"
                    params={{ category: c.name }}
                    className="text-foreground/70 underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {c.name}
                  </Link>
                ))}
              </span>
            )}
            {tags.length > 0 && (
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-foreground/50">Tag:</span>
                {tags.map((t) => (
                  <Link
                    key={t.slug}
                    to="/blog/tag/$tag"
                    params={{ tag: t.name }}
                    className="text-foreground/70 underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {t.name}
                  </Link>
                ))}
              </span>
            )}
            {series.length > 0 && (
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-foreground/50">Series:</span>
                {series.map((s) => (
                  <Link
                    key={s.slug}
                    to="/blog/series/$series"
                    params={{ series: s.slug }}
                    className="text-foreground/70 underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {s.title}
                  </Link>
                ))}
              </span>
            )}
          </div>
        </nav>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        {isLoading ? (
          <PostCardGridSkeleton count={6} />
        ) : posts && posts.length > 0 ? (
          <>
            <div className="space-y-8">
              {currentPagePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav
                className="border-border/30 border-t pt-8 mt-8"
                aria-label="Pagination"
              >
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-foreground/60 text-sm">
                    Showing {(page - 1) * POSTS_PER_PAGE + 1} to{" "}
                   	{Math.min(page * POSTS_PER_PAGE, posts.length)} of {posts.length}{" "}
                   	posts
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                     	onClick={() => setPage(Math.max(1, page - 1))}
                     	disabled={page === 1}
                     	className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                       	let pageNum;
                       	if (totalPages <= 5) {
                       	  pageNum = i + 1;
                       	} else if (page <= 3) {
                       	  pageNum = i + 1;
                       	} else if (page >= totalPages - 2) {
                       	  pageNum = totalPages - 4 + i;
                       	} else {
                       	  pageNum = page - 2 + i;
                       	}

                       	return (
                       	  <Button
                       	    key={pageNum}
                       	    variant={page === pageNum ? "default" : "outline"}
                       	    size="sm"
                       	    onClick={() => setPage(pageNum)}
                       	    className="min-w-[2.5rem]"
                       	  >
                       	    {pageNum}
                       	  </Button>
                       	);
                      })}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                     	onClick={() => setPage(Math.min(totalPages, page + 1))}
                     	disabled={page === totalPages}
                     	className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </nav>
            )}
          </>
        ) : isError ? (
          <p className="text-foreground/50 text-sm">
            Couldn’t load posts. {error?.message ?? "Try again later."}
          </p>
        ) : (
          <p className="text-foreground/50 text-sm">
            No posts yet. Create one in the admin or run the database seed for
            sample data.
          </p>
        )}
      </section>
    </main>
  );
}
