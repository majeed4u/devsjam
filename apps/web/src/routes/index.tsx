import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { PostView } from "@/components/PostView";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  const { data: posts } = useQuery(orpc.posts.getPosts.queryOptions());

  return (
    <div className=" mx-auto">
      <h1>DevJams Blog</h1>
      <div className="space-y-12">
        {posts?.map((post) => (
          <PostView key={post.id} post={post as any} />
        ))}
      </div>
    </div>
  );
}
