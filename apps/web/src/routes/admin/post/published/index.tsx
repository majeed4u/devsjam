import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Archive,
  Calendar,
  CirclePlus,
  Edit,
  Eye,
  FileText,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PostListSkeleton,
  SearchBarSkeleton,
} from "@/components/skeletons/list-skeleton";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";
import { queryClient } from "@/utils/orpc";

export const Route = createFileRoute("/admin/post/published/")({
  component: PublishedPostsComponent,
});

function PublishedPostsComponent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [unpublishConfirm, setUnpublishConfirm] = useState<string | null>(null);
  const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null);
  const [publishConfirm, setPublishConfirm] = useState<string | null>(null);

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

  const handleUnpublish = (postId: string) => {
    updatePost.mutate(
      { id: postId, published: false },
      {
        onSuccess: () => {
          toast.success("Post unpublished");
          setUnpublishConfirm(null);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const handlePublish = (postId: string) => {
    updatePost.mutate(
      { id: postId, published: true },
      {
        onSuccess: () => {
          toast.success("Post published");
          setPublishConfirm(null);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const handleArchive = (postId: string) => {
    updatePost.mutate(
      { id: postId, archived: true, published: false },
      {
        onSuccess: () => {
          toast.success("Post archived");
          setArchiveConfirm(null);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const q = searchQuery.toLowerCase();
  const publishedPosts = allPosts.filter(
    (p) =>
      p.published &&
      !p.archived &&
      p.title.toLowerCase().includes(q),
  );
  const draftPosts = allPosts.filter(
    (p) =>
      !p.published &&
      !p.archived &&
      p.title.toLowerCase().includes(q),
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl">Published & Drafts</h1>
          <p className="mt-1 text-foreground/60">
            {publishedPosts.length} published, {draftPosts.length} draft
          </p>
        </div>
        <Link to="/admin/post/new">
          <Button className="flex items-center gap-2">
            <CirclePlus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="relative">
        {isLoading ? (
          <SearchBarSkeleton />
        ) : (
          <>
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/50 py-2 pr-4 pl-10 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </>
        )}
      </div>

      <div className="space-y-8">
        {/* Published */}
        <section>
          <h2 className="mb-3 font-semibold text-lg text-foreground">
            Published
          </h2>
          <div className="overflow-hidden rounded-lg border border-border/40 bg-card/50">
            {publishedPosts.length > 0 ? (
              <div className="divide-y divide-border/40">
                {publishedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative flex items-start justify-between p-6 transition-colors hover:bg-background/30"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 font-semibold text-lg">
                        {post.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-foreground/60 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views || 0} views
                        </span>
                        <span className="rounded bg-green-500/10 px-2 py-0.5 text-green-600 text-xs dark:text-green-400">
                          Published
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() =>
                          navigate({ to: "/admin/post/$postId/edit", params: { postId: post.id } })
                        }
                        className="rounded-lg p-2 text-foreground/60 hover:bg-accent hover:text-foreground"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setUnpublishConfirm(post.id)}
                        className="rounded-lg p-2 text-foreground/60 hover:bg-amber-500/10 hover:text-amber-600"
                        title="Unpublish"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setArchiveConfirm(post.id)}
                        className="rounded-lg p-2 text-foreground/60 hover:bg-accent hover:text-foreground"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="rounded-lg p-2 text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {unpublishConfirm === post.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
                        <p className="font-medium text-sm">Unpublish this post?</p>
                        <button
                          onClick={() => setUnpublishConfirm(null)}
                          className="rounded px-3 py-1 text-sm hover:bg-accent"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUnpublish(post.id)}
                          disabled={updatePost.isPending}
                          className="rounded bg-amber-500 px-3 py-1 text-white text-sm hover:bg-amber-600 disabled:opacity-50"
                        >
                          Unpublish
                        </button>
                      </div>
                    )}
                    {archiveConfirm === post.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
                        <p className="font-medium text-sm">Archive this post?</p>
                        <button
                          onClick={() => setArchiveConfirm(null)}
                          className="rounded px-3 py-1 text-sm hover:bg-accent"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleArchive(post.id)}
                          disabled={updatePost.isPending}
                          className="rounded bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
                        >
                          Archive
                        </button>
                      </div>
                    )}
                    {deleteConfirm === post.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
                        <p className="font-medium text-sm">Delete post?</p>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded px-3 py-1 text-sm hover:bg-accent"
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded bg-destructive px-3 py-1 text-destructive-foreground text-sm hover:bg-destructive/90"
                          onClick={() => {
                            // TODO: delete endpoint when available
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
                <Eye className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="mb-4">No published posts yet.</p>
                <Link to="/admin/post/new">
                  <Button variant="outline" size="sm">
                    Create your first post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Drafts */}
        <section>
          <h2 className="mb-3 font-semibold text-lg text-foreground">
            Drafts
          </h2>
          <div className="overflow-hidden rounded-lg border border-border/40 bg-card/50">
            {draftPosts.length > 0 ? (
              <div className="divide-y divide-border/40">
                {draftPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative flex items-start justify-between p-6 transition-colors hover:bg-background/30"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 font-semibold text-lg text-foreground/90">
                        {post.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-foreground/60 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-600 text-xs dark:text-amber-400">
                          Draft
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() =>
                          navigate({ to: "/admin/post/$postId/edit", params: { postId: post.id } })
                        }
                        className="rounded-lg p-2 text-foreground/60 hover:bg-accent hover:text-foreground"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setPublishConfirm(post.id)}
                        className="rounded-lg p-2 text-foreground/60 hover:bg-green-500/10 hover:text-green-600"
                        title="Publish"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="rounded-lg p-2 text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {publishConfirm === post.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
                        <p className="font-medium text-sm">Publish this post?</p>
                        <button
                          onClick={() => setPublishConfirm(null)}
                          className="rounded px-3 py-1 text-sm hover:bg-accent"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePublish(post.id)}
                          disabled={updatePost.isPending}
                          className="rounded bg-green-500 px-3 py-1 text-white text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          Publish
                        </button>
                      </div>
                    )}
                    {deleteConfirm === post.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
                        <p className="font-medium text-sm">Delete post?</p>
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
              <div className="py-8 text-center text-foreground/60 text-sm">
                No drafts.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
