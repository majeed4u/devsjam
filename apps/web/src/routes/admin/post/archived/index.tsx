import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Archive, Calendar, RotateCcw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PostListSkeleton,
  SearchBarSkeleton,
} from "@/components/skeletons/list-skeleton";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";

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

  const publishPost = useMutation({
    mutationFn: async (postId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      toast.success("Post published successfully");
    },
  });

  // Filter archived posts
  const archivedPosts =
    posts?.filter(
      (p) =>
        !p.published &&
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl">Draft Posts</h1>
        <p className="mt-1 text-foreground/60">
          {archivedPosts.length} draft post
          {archivedPosts.length !== 1 ? "s" : ""}
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
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search draft posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/50 py-2 pr-4 pl-10 text-foreground transition-all duration-200 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </>
        )}
      </div>

      {/* Posts List */}
      <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
        {isLoading ? (
          <PostListSkeleton count={5} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border/40 bg-card/50">
            {archivedPosts.length > 0 ? (
              <div className="divide-y divide-border/40">
                {archivedPosts.map((post, idx) => {
                  const archivedDate = post.updatedAt
                    ? new Date(post.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "";

                  return (
                    <div
                      key={post.id}
                      className="group relative flex animate-slide-in-up items-start justify-between p-6 opacity-75 transition-colors duration-200 hover:bg-background/30"
                      style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-1 font-semibold text-foreground/60 text-lg line-through">
                          {post.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-foreground/60 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            Updated {archivedDate}
                          </div>
                          <span className="rounded bg-destructive/10 px-2 py-0.5 text-destructive text-xs">
                            Draft
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex flex-shrink-0 gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() => setRestoreConfirm(post.id)}
                          className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
                          title="Publish"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="rounded-lg p-2 text-destructive/60 transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
                          title="Delete permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Publish Confirmation */}
                      {restoreConfirm === post.id && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/80 backdrop-blur-sm">
                          <p className="font-medium text-sm">Publish post?</p>
                          <button
                            onClick={() => setRestoreConfirm(null)}
                            className="rounded px-3 py-1 text-sm transition-colors hover:bg-accent"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              publishPost.mutate(post.id);
                              setRestoreConfirm(null);
                            }}
                            className="rounded bg-accent px-3 py-1 text-accent-foreground text-sm transition-colors hover:bg-accent/90"
                          >
                            Publish
                          </button>
                        </div>
                      )}

                      {/* Delete Confirmation */}
                      {deleteConfirm === post.id && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/80 backdrop-blur-sm">
                          <p className="font-medium text-sm">
                            Delete permanently?
                          </p>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded px-3 py-1 text-sm transition-colors hover:bg-accent"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              deletePost.mutate(post.id);
                              setDeleteConfirm(null);
                            }}
                            className="rounded bg-destructive px-3 py-1 text-destructive-foreground text-sm transition-colors hover:bg-destructive/90"
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
              <div className="py-12 text-center text-foreground/60">
                <Archive className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>No draft posts.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
