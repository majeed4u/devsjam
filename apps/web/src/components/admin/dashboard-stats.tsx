import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { BarChart3, BookOpen, Eye, TrendingUp } from "lucide-react";

export function DashboardStats() {
  const { data: posts } = useQuery(orpc.post.getPosts.queryOptions());

  // Calculate stats
  const totalPosts = posts?.length ?? 0;
  const publishedPosts = posts?.filter((p) => !p.deletedAt).length ?? 0;
  const totalViews = posts?.reduce((acc, p) => acc + (p.views || 0), 0) ?? 0;
  const avgReadingTime =
    posts && posts.length > 0
      ? Math.round(
          posts.reduce((acc, p) => acc + (p.readingTime || 0), 0) /
            posts.length,
        )
      : 0;

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: BookOpen,
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      label: "Published",
      value: publishedPosts,
      icon: TrendingUp,
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-500",
    },
    {
      label: "Total Views",
      value: totalViews?.toLocaleString() || "0",
      icon: Eye,
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
    },
    {
      label: "Avg Reading Time",
      value: `${avgReadingTime} min`,
      icon: BarChart3,
      color: "from-orange-500/10 to-orange-500/5",
      iconColor: "text-orange-500",
    },
  ];

  return (
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
            <div className="text-xs text-foreground/50">Last 30 days</div>
          </div>
        );
      })}
    </div>
  );
}
