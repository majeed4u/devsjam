import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import type { Post } from "../../../../packages/db/prisma/generated/client";

interface RecentActivityProps {
  posts: Post[];
}

export function RecentActivity({ posts }: RecentActivityProps) {
  // Get most recent posts
  const recentPosts = posts
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  if (recentPosts.length === 0) {
    return (
      <div className="rounded-lg border border-border/40 bg-card/50 p-8 text-center">
        <p className="text-foreground/60">
          No posts yet. Create your first post to get started!
        </p>
        <Link to="/admin/post/new">
          <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors duration-200">
            Create Post
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
      <div className="p-6 border-b border-border/40">
        <h2 className="text-xl font-bold">Recent Posts</h2>
      </div>
      <div className="divide-y divide-border/40">
        {recentPosts.map((post) => {
          const publishDate = new Date(post.createdAt).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" },
          );
          const slug =
            post.slug || post.title.toLowerCase().replace(/\s+/g, "-");

          return (
            <div
              key={post.id}
              className="p-6 hover:bg-background/30 transition-colors duration-200 flex items-start justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {publishDate}
                  </div>
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                </div>
              </div>
              <Link
                to={`/admin/post/${post.id}`}
                className="ml-4 flex-shrink-0 text-primary hover:text-primary/80 transition-colors duration-200"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
