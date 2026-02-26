import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PostCard } from "@/components/post/post-card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery(orpc.post.getPosts.queryOptions());

  return (
    <main className="w-full">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Simple blog intro — no hero, no CTAs */}
        <header className="mb-12 border-border/50 border-b pb-8">
          <h1 className="font-semibold text-2xl tracking-tight text-foreground sm:text-3xl">
            DevJams
          </h1>
          <p className="mt-2 text-foreground/70 text-xl font-medium leading-relaxed">
            A personal blog about DevOps, infrastructure, CI/CD, and making
            systems reliable. Notes from the trenches.
          </p>
          <nav className="mt-4 flex gap-6 text-sm">
            <Link
              to="/blog"
              className="text-foreground/60 underline-offset-4 hover:text-foreground hover:underline"
            >
              All posts
            </Link>
            <Link
              to="/about"
              className="text-foreground/60 underline-offset-4 hover:text-foreground hover:underline"
            >
              About
            </Link>
          </nav>
        </header>

        {/* Recent posts — content first */}
        <section>
          <h2 className="mb-6 font-medium text-foreground/80 text-sm uppercase tracking-wider">
            Recent posts
          </h2>

          {isLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-md bg-muted/50"
                />
              ))}
            </div>
          )}

          {isError ? (
            <p className="text-foreground/50 text-sm">
              Couldn’t load posts. {error?.message ?? "Try again later."}
            </p>
          ) : posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-foreground/50 text-sm">
              No posts yet. Create one in the admin or run the database seed for
              sample data.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
