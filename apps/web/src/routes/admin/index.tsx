import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CirclePlus } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentActivity } from "@/components/admin/recent-activity";
import { RecentActivitySkeleton } from "@/components/skeletons/admin-skeleton";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
	const { data: posts, isLoading } = useQuery(
		orpc.post.getPostsForAdmin.queryOptions(),
	);

	return (
		<div className="animate-fade-in space-y-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-3xl">Dashboard</h1>
					<p className="mt-1 text-foreground/60">
						Welcome back! Here's your blog overview.
					</p>
				</div>
				<Link to="/admin/post/new">
					<Button className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95">
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
