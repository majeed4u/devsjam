import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentActivity } from "@/components/admin/recent-activity";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { RecentActivitySkeleton } from "@/components/skeletons/admin-skeleton";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
  const { data: posts, isLoading } = useQuery(
    orpc.post.getPosts.queryOptions(),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-foreground/60 mt-1">
            Welcome back! Here's your blog overview.
          </p>
        </div>
        <Link to="/admin/post/new">
          <Button className="flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-200">
            <CirclePlus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <section
        className="animate-slide-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <DashboardStats />
      </section>

      <section
        className="animate-slide-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {isLoading ? (
          <RecentActivitySkeleton />
        ) : (
          <RecentActivity posts={posts ?? []} />
        )}
      </section>
    </div>
  );
}
