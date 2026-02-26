import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { PostCard } from "@/components/post/post-card";
import { PostCardGridSkeleton } from "@/components/skeletons/post-card-skeleton";

export const Route = createFileRoute("/blog/series/$series/")({
  component: SeriesPageComponent,
});

function SeriesPageComponent() {
  const { series: seriesSlug } = useParams({ from: "/blog/series/$series/" });
  const { data: posts = [], isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );

  const decodedSeries = decodeURIComponent(seriesSlug);
  const seriesPosts = posts.filter(
    (p) => p.series?.slug.toLowerCase() === decodedSeries.toLowerCase(),
  );

  const sortedByOrder = [...seriesPosts].sort(
    (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0),
  );
  const seriesTitle = seriesPosts[0]?.series?.title ?? decodedSeries;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          to="/blog"
          className="text-foreground/60 text-sm hover:text-foreground hover:underline"
        >
          ← Blog
        </Link>
        <header className="mt-4 border-border/30 border-b pb-6">
          <h1 className="font-semibold text-2xl text-foreground sm:text-3xl">
            Series: {seriesTitle}
          </h1>
          <p className="mt-1 text-foreground/60 text-sm">
            {sortedByOrder.length} post{sortedByOrder.length !== 1 ? "s" : ""}{" "}
            in this series
          </p>
        </header>

        <section className="mt-8 space-y-8">
          {isLoading ? (
            <PostCardGridSkeleton count={4} />
          ) : sortedByOrder.length > 0 ? (
            sortedByOrder.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-foreground/50 text-sm">
              No posts found in this series.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
