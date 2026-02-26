import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { BlogLayout } from "@/components/layout/blog-layout";
import { PersonalHero } from "@/components/blog/personal-hero";
import { PersonalFeaturedPost } from "@/components/blog/personal-featured-post";
import { PersonalPostsList } from "@/components/blog/personal-posts-list";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data: posts } = useQuery(orpc.post.getPosts.queryOptions());

  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  const otherPosts = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <BlogLayout>
      {/* Personal Hero */}
      <PersonalHero />

      {/* Featured Post */}
      {featuredPost && <PersonalFeaturedPost post={featuredPost as any} />}

      {/* Latest Posts */}
      {otherPosts.length > 0 && <PersonalPostsList posts={otherPosts as any} />}
    </BlogLayout>
  );
}
