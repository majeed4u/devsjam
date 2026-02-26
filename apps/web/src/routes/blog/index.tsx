import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { PostCard } from "@/components/post/post-card";

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold">Blog Articles</h1>
          <p className="text-xl text-foreground/70">
            Explore my latest thoughts on web development, software
            architecture, and technology.
          </p>
        </div>

        {/* Filter/Sort Options */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors duration-200">
            All Posts
          </button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent text-sm transition-colors duration-200">
            Latest
          </button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent text-sm transition-colors duration-200">
            Most Popular
          </button>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-accent/50 animate-pulse"
              />
            ))}
          </div>
        )}

        {posts && posts.length > 0 ? (
          <div className="grid gap-6 md:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
