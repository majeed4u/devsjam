import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { BlogLayout } from "@/components/layout/blog-layout";
import { FeaturedPostHero } from "@/components/blog/featured-post-hero";
import { PostGrid } from "@/components/blog/post-grid";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data: posts } = useQuery(orpc.post.getPosts.queryOptions());

  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  const otherPosts = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <BlogLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-4">
            Welcome to DevJams
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Exploring software development, technology, and sharing insights
            from my journey as a developer.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && <FeaturedPostHero post={featuredPost as any} />}

        {/* Other Posts Grid */}
        {otherPosts.length > 0 && <PostGrid posts={otherPosts as any} />}
      </div>
    </BlogLayout>
  );
}
