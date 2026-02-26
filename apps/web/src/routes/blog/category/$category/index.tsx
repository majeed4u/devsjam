import {
  createFileRoute,
  getRouteApi,
  useParams,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { PostCard } from "@/components/post/post-card";
import { PostCardGridSkeleton } from "@/components/skeletons/post-card-skeleton";
import { ArrowLeft } from "lucide-react";
const routeApi = getRouteApi("/blog/category/$category/");
export const Route = createFileRoute("/blog/category/$category/")({
  component: CategoryPageComponent,
});

function CategoryPageComponent() {
  const { category } = routeApi.useParams();
  const { data: posts, isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );

  const decodedCategory = decodeURIComponent(category);
  const filteredPosts =
    posts?.filter(
      (p) => p.category?.name.toLowerCase() === decodedCategory.toLowerCase(),
    ) ?? [];

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 animate-fade-in">
          <a
            href="/blog/"
            className="inline-flex items-center gap-2 text-primary font-medium hover:translate-x-1 transition-transform duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </a>
          <div>
            <h1 className="text-4xl font-bold">Category: {decodedCategory}</h1>
            <p className="text-foreground/60 mt-2">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}{" "}
              in this category
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
          {isLoading ? (
            <PostCardGridSkeleton count={6} />
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="animate-slide-in-up"
                  style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">
                No posts found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
