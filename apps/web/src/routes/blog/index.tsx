import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/post/post-card";
import { PostCardGridSkeleton } from "@/components/skeletons/post-card-skeleton";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/blog/")({
  component: BlogComponent,
});

function BlogComponent() {
  const { data: posts, isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );

  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <section className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="font-bold text-4xl sm:text-5xl">Blog Articles</h1>
          <p className="text-foreground/70 text-xl">
            Explore my latest thoughts on web development, software
            architecture, and technology.
          </p>
        </div>

        {/* Filter/Sort Options */}
        <div
          className="flex flex-wrap gap-2 animate-slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <button className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95">
            All Posts
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95">
            Latest
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95">
            Most Popular
          </button>
        </div>
      </section>

      {/* Posts Grid */}
      <section
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 animate-slide-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {isLoading ? (
          <PostCardGridSkeleton count={6} />
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6 md:gap-8">
            {posts.map((post, idx) => (
              <div
                key={post.id}
                className="animate-slide-in-up"
                style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-foreground/60 text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
