import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { PostCard } from "@/components/post/post-card";
import { PostCardGridSkeleton } from "@/components/skeletons/post-card-skeleton";

export const Route = createFileRoute("/blog/tag/$tag/")({
  component: TagPageComponent,
});

function TagPageComponent() {
  const { tag } = useParams({ from: "/blog/tag/$tag/" });
  const { data: posts = [], isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );
  const decodedTag = decodeURIComponent(tag);
  const filteredPosts = posts.filter((p) =>
    p.tags?.some((t) => t.name.toLowerCase() === decodedTag.toLowerCase()),
  );

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
            Tag: {decodedTag}
          </h1>
          <p className="mt-1 text-foreground/60 text-sm">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}{" "}
            tagged with this
          </p>
        </header>

        <section className="mt-8 space-y-8">
          {isLoading ? (
            <PostCardGridSkeleton count={4} />
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-foreground/50 text-sm">
              No posts found with this tag.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
