import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Eye, TrendingUp, Users } from "lucide-react";
import { DashboardStatsSkeleton } from "@/components/skeletons/admin-skeleton";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/admin/analytics/")({
	component: AnalyticsComponent,
});

function AnalyticsComponent() {
	const { data: posts, isLoading } = useQuery(
		orpc.post.getPosts.queryOptions(),
	);

	if (isLoading) {
		return <DashboardStatsSkeleton />;
	}

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
		<div className="animate-fade-in space-y-8">
			{/* Header */}
			<div>
				<h1 className="font-bold text-3xl">Analytics</h1>
				<p className="mt-1 text-foreground/60">
					Track your blog performance and engagement
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, idx) => {
					const Icon = stat.icon;
					return (
						<div
							key={stat.label}
							className={`rounded-lg border border-border/40 bg-gradient-to-br ${stat.color} animate-slide-in-up p-6 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:shadow-lg`}
							style={{ animationDelay: `${idx * 0.1}s` }}
						>
							<div className="mb-4 flex items-start justify-between">
								<div>
									<p className="font-medium text-foreground/60 text-sm">
										{stat.label}
									</p>
									<h3 className="mt-1 font-bold text-3xl">{stat.value}</h3>
								</div>
								<div
									className={`rounded-lg bg-background/50 p-2.5 ${stat.iconColor}`}
								>
									<Icon className="h-5 w-5" />
								</div>
							</div>
							<div className="font-medium text-primary text-xs">
								{stat.change} this month
							</div>
						</div>
					);
				})}
			</div>

			{/* Top Posts */}
			<div
				className="animate-slide-in-up overflow-hidden rounded-lg border border-border/40 bg-card/50"
				style={{ animationDelay: "0.4s" }}
			>
				<div className="border-border/40 border-b p-6">
					<h2 className="font-bold text-xl">Top Posts</h2>
				</div>
				{topPosts.length > 0 ? (
					<div className="divide-y divide-border/40">
						{topPosts.map((post, index) => (
							<div
								key={post.id}
								className="flex animate-slide-in-up items-center justify-between p-6 transition-colors duration-200 hover:bg-background/30"
								style={{ animationDelay: `${0.5 + index * 0.05}s` }}
							>
								<div className="flex flex-1 items-center gap-6">
									<div className="w-8 font-bold text-3xl text-primary/50">
										{index + 1}
									</div>
									<div className="flex-1">
										<h3 className="font-semibold">{post.title}</h3>
										<p className="mt-1 text-foreground/60 text-sm">
											{post.readingTime} min read
										</p>
									</div>
								</div>
								<div className="text-right">
									<div className="font-bold text-2xl">
										{(post.views || 0).toLocaleString()}
									</div>
									<div className="text-foreground/60 text-xs">views</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="py-12 text-center text-foreground/60">
						<p>No analytics data yet.</p>
					</div>
				)}
			</div>
		</div>
	);
}
