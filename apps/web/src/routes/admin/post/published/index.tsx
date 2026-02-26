import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  CirclePlus,
  Search,
  Archive,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/post/published/")({
  component: PublishedPostsComponent,
});

function PublishedPostsComponent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { data: posts, isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      // TODO: Call your delete endpoint
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      // Refetch posts
    },
  });

  // Filter published posts
  const publishedPosts =
    posts?.filter(
      (p) =>
        !p.deletedAt &&
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Published Posts</h1>
          <p className="text-foreground/60 mt-1">
            {publishedPosts.length} post{publishedPosts.length !== 1 ? "s" : ""}{" "}
            published
          </p>
        </div>
        <Link to="/admin/post/new">
          <Button className="flex items-center gap-2">
            <CirclePlus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      </div>

      {/* Posts List */}
      <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
        {isLoading && (
          <div className="space-y-2 p-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-accent/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {publishedPosts.length > 0 ? (
          <div className="divide-y divide-border/40">
            {publishedPosts.map((post) => {
              const publishDate = new Date(post.createdAt).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" },
              );

              return (
                <div
                  key={post.id}
                  className="p-6 hover:bg-background/30 transition-colors duration-200 flex items-start justify-between group relative"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-200">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-foreground/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        {publishDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 flex-shrink-0" />
                        {post.views || 0} views
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                        Published
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => navigate({ to: `/admin/post/${post.id}` })}
                      className="p-2 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(post.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === post.id && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center gap-3 z-10">
                      <p className="text-sm font-medium">Delete post?</p>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 rounded text-sm hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deletePost.mutate(post.id)}
                        className="px-3 py-1 rounded text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12 text-foreground/60">
            <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-4">No published posts yet.</p>
            <Link to="/admin/post/new">
              <Button variant="outline" size="sm">
                Create your first post
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
