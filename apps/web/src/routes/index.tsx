import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { PostCard } from "@/components/post/post-card";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data: posts, isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );

  return (
    <main className="w-full bg-gradient-to-b from-background via-background to-background/50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DevJams
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 font-light leading-relaxed">
              Sharing experiences, knowledge, and technical insights about web
              development, software architecture, and building products that
              matter.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors duration-200">
              Explore Posts
            </button>
            <button className="px-6 py-2 rounded-lg border border-border hover:bg-accent transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Latest Articles
          </h2>
          <p className="text-foreground/60">
            Thoughts on tech, development, and building better software
          </p>
        </div>

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
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60">No posts yet. Check back soon!</p>
          </div>
        )}
      </section>
    </main>
  );
}
