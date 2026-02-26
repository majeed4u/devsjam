import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { TrendingUp, Eye, BookOpen, Users } from "lucide-react";

export const Route = createFileRoute("/admin/analytics/")({
  component: AnalyticsComponent,
});

function AnalyticsComponent() {
  const { data: posts } = useQuery(orpc.post.getPosts.queryOptions());

  // Calculate analytics
  const totalPosts = posts?.length ?? 0;
  const totalViews = posts?.reduce((acc, p) => acc + (p.views || 0), 0) ?? 0;
  const avgViews = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;
  const topPosts =
    posts?.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5) ?? [];

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: BookOpen,
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
      change: "+0",
    },
    {
      label: "Total Views",
      value: totalViews?.toLocaleString() || "0",
      icon: Eye,
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
      change: "+0",
    },
    {
      label: "Average Views/Post",
      value: avgViews,
      icon: TrendingUp,
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-500",
      change: "+0",
    },
    {
      label: "Avg Reading Time",
      value: posts
        ? `${Math.round(posts.reduce((acc, p) => acc + (p.readingTime || 0), 0) / posts.length)} min`
        : "0 min",
      icon: Users,
      color: "from-orange-500/10 to-orange-500/5",
      iconColor: "text-orange-500",
      change: "+0",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-foreground/60 mt-1">
          Track your blog performance and engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border border-border/40 bg-gradient-to-br ${stat.color} p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-foreground/60 font-medium">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div
                  className={`p-2.5 rounded-lg bg-background/50 ${stat.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs text-primary font-medium">
                {stat.change} this month
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Posts */}
      <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
        <div className="p-6 border-b border-border/40">
          <h2 className="text-xl font-bold">Top Posts</h2>
        </div>
        {topPosts.length > 0 ? (
          <div className="divide-y divide-border/40">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-3xl font-bold text-primary/50 w-8">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-foreground/60 mt-1">
                      {post.readingTime} min read
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {(post.views || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-foreground/60">views</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-foreground/60">
            <p>No analytics data yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
