import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2, Calendar, Search, Archive } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PostListSkeleton,
  SearchBarSkeleton,
} from "@/components/skeletons/list-skeleton";

export const Route = createFileRoute("/admin/post/archived/")({
  component: ArchivedPostsComponent,
});

function ArchivedPostsComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);
  const { data: posts, isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      toast.success("Post deleted permanently");
    },
  });

  const restorePost = useMutation({
    mutationFn: async (postId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      toast.success("Post restored");
    },
  });

  // Filter archived posts
  const archivedPosts =
    posts?.filter(
      (p) =>
        p.deletedAt &&
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Archived Posts</h1>
        <p className="text-foreground/60 mt-1">
          {archivedPosts.length} post{archivedPosts.length !== 1 ? "s" : ""}{" "}
          archived
        </p>
      </div>

      {/* Search */}
      <div
        className="relative animate-slide-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {isLoading ? (
          <SearchBarSkeleton />
        ) : (
          <>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search archived posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </>
        )}
      </div>

      {/* Posts List */}
      <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
        {isLoading ? (
          <PostListSkeleton count={5} />
        ) : (
          <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
            {archivedPosts.length > 0 ? (
              <div className="divide-y divide-border/40">
                {archivedPosts.map((post, idx) => {
                  const archivedDate = post.deletedAt
                    ? new Date(post.deletedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "";

                  return (
                    <div
                      key={post.id}
                      className="p-6 hover:bg-background/30 transition-colors duration-200 flex items-start justify-between group opacity-75 relative animate-slide-in-up"
                      style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-1 line-through text-foreground/60">
                          {post.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-foreground/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            Archived {archivedDate}
                          </div>
                          <span className="px-2 py-0.5 rounded text-xs bg-destructive/10 text-destructive">
                            Archived
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => setRestoreConfirm(post.id)}
                          className="p-2 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-colors duration-200"
                          title="Restore"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-colors duration-200"
                          title="Delete permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Restore Confirmation */}
                      {restoreConfirm === post.id && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center gap-3 z-10">
                          <p className="text-sm font-medium">Restore post?</p>
                          <button
                            onClick={() => setRestoreConfirm(null)}
                            className="px-3 py-1 rounded text-sm hover:bg-accent transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              restorePost.mutate(post.id);
                              setRestoreConfirm(null);
                            }}
                            className="px-3 py-1 rounded text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                          >
                            Restore
                          </button>
                        </div>
                      )}

                      {/* Delete Confirmation */}
                      {deleteConfirm === post.id && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center gap-3 z-10">
                          <p className="text-sm font-medium">
                            Delete permanently?
                          </p>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 rounded text-sm hover:bg-accent transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              deletePost.mutate(post.id);
                              setDeleteConfirm(null);
                            }}
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
            ) : (
              <div className="text-center py-12 text-foreground/60">
                <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No archived posts.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
