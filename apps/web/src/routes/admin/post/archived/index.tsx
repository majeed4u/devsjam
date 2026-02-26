import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Archive, Calendar, RotateCcw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PostListSkeleton,
  SearchBarSkeleton,
} from "@/components/skeletons/list-skeleton";
import { orpc } from "@/utils/orpc";
import { queryClient } from "@/utils/orpc";

export const Route = createFileRoute("/admin/post/archived/")({
  component: ArchivedPostsComponent,
});

function ArchivedPostsComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);

  const { data: allPosts = [], isLoading } = useQuery(
    orpc.post.getPostsForAdmin.queryOptions(),
  );

  const updatePost = useMutation({
    ...orpc.post.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(orpc.post.getPostsForAdmin.queryOptions());
      queryClient.invalidateQueries(orpc.post.getPosts.queryOptions());
    },
  });

  const handleRestore = (postId: string, asDraft: boolean) => {
    updatePost.mutate(
      { id: postId, archived: false, ...(asDraft ? {} : { published: true }) },
      {
        onSuccess: () => {
          toast.success(asDraft ? "Restored to drafts" : "Restored and published");
          setRestoreConfirm(null);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const q = searchQuery.toLowerCase();
  const archivedPosts = allPosts.filter(
    (p) => p.archived && p.title.toLowerCase().includes(q),
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-bold text-3xl">Archived Posts</h1>
        <p className="mt-1 text-foreground/60">
          {archivedPosts.length} archived post{archivedPosts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="relative">
        {isLoading ? (
          <SearchBarSkeleton />
        ) : (
          <>
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search archived posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/50 py-2 pr-4 pl-10 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border/40 bg-card/50">
        {isLoading ? (
          <PostListSkeleton count={5} />
        ) : archivedPosts.length > 0 ? (
          <div className="divide-y divide-border/40">
            {archivedPosts.map((post) => (
              <div
                key={post.id}
                className="group relative flex items-start justify-between p-6 opacity-90 transition-colors hover:bg-background/30"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 font-semibold text-foreground/80 text-lg">
                    {post.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-foreground/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.updatedAt
                        ? new Date(post.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                    <span className="rounded bg-muted px-2 py-0.5 text-foreground/70 text-xs">
                      Archived
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setRestoreConfirm(post.id)}
                    className="rounded-lg p-2 text-foreground/60 hover:bg-green-500/10 hover:text-green-600"
                    title="Restore"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    className="rounded-lg p-2 text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {restoreConfirm === post.id && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
                    <p className="font-medium text-sm">Restore this post?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRestoreConfirm(null)}
                        className="rounded px-3 py-1 text-sm hover:bg-accent"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRestore(post.id, true)}
                        disabled={updatePost.isPending}
                        className="rounded bg-muted px-3 py-1 text-muted-foreground text-sm hover:bg-muted/80 disabled:opacity-50"
                      >
                        Restore as draft
                      </button>
                      <button
                        onClick={() => handleRestore(post.id, false)}
                        disabled={updatePost.isPending}
                        className="rounded bg-green-500 px-3 py-1 text-white text-sm hover:bg-green-600 disabled:opacity-50"
                      >
                        Restore & publish
                      </button>
                    </div>
                  </div>
                )}

                {deleteConfirm === post.id && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
                    <p className="font-medium text-sm">Delete permanently?</p>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded px-3 py-1 text-sm hover:bg-accent"
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded bg-destructive px-3 py-1 text-destructive-foreground text-sm hover:bg-destructive/90"
                      onClick={() => {
                        setDeleteConfirm(null);
                        toast.info("Delete not implemented yet");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-foreground/60">
            <Archive className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p>No archived posts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
