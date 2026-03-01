import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Users, TrendingUp, UserCheck, UserX, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/admin/newsletter/")({
	component: NewsletterAdminComponent,
});

function NewsletterAdminComponent() {
	const [activeOnly, setActiveOnly] = useState(false);
	const [page, setPage] = useState(0);
	const limit = 20;

	// Fetch stats
	const { data: stats, isLoading: statsLoading } = useQuery(
		orpc.newsletter.getStats.queryOptions(),
	);

	// Fetch subscribers
	const { data: subscribersData, isLoading: subscribersLoading, refetch } = useQuery(
		orpc.newsletter.getSubscribers.queryOptions({
			input: {
				activeOnly,
				limit,
				offset: page * limit,
			},
		}),
	);

	// Delete subscriber mutation
	const deleteSubscriber = useMutation(
		orpc.newsletter.deleteSubscriber.mutationOptions({
			onSuccess: () => {
				toast.success("Subscriber deleted");
				refetch();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete subscriber");
			},
		}),
	);

	const handleDelete = (id: string, email: string) => {
		if (confirm(`Delete ${email} from subscribers?`)) {
			deleteSubscriber.mutate({ id });
		}
	};

	const handlePrevPage = () => {
		if (page > 0) setPage(page - 1);
	};

	const handleNextPage = () => {
		if (subscribersData?.hasMore) setPage(page + 1);
	};

	const statsCards = [
		{
			label: "Total Subscribers",
			value: stats?.total ?? 0,
			icon: Users,
			color: "from-blue-500/10 to-blue-500/5",
			iconColor: "text-blue-500",
		},
		{
			label: "Active",
			value: stats?.active ?? 0,
			icon: UserCheck,
			color: "from-green-500/10 to-green-500/5",
			iconColor: "text-green-500",
		},
		{
			label: "Inactive",
			value: stats?.inactive ?? 0,
			icon: UserX,
			color: "from-red-500/10 to-red-500/5",
			iconColor: "text-red-500",
		},
		{
			label: "New (30d)",
			value: stats?.recent ?? 0,
			icon: TrendingUp,
			color: "from-purple-500/10 to-purple-500/5",
			iconColor: "text-purple-500",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-3xl">Newsletter</h1>
					<p className="mt-1 text-foreground/60">
						Manage your newsletter subscribers
					</p>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statsCards.map((stat, idx) => {
					const Icon = stat.icon;
					return (
						<div
							key={stat.label}
							className={`rounded-lg border border-border/40 bg-linear-to-br ${stat.color} p-6`}
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
						</div>
					);
				})}
			</div>

			{/* Subscribers Table */}
			<div className="overflow-hidden rounded-lg border border-border/40 bg-card/50">
				<div className="border-border/40 border-b p-6">
					<div className="flex items-center justify-between">
						<h2 className="font-bold text-xl">Subscribers</h2>
						<Button
							variant={activeOnly ? "default" : "outline"}
							size="sm"
							onClick={() => {
								setActiveOnly(!activeOnly);
								setPage(0);
							}}
						>
							{activeOnly ? "Show All" : "Active Only"}
						</Button>
					</div>
				</div>

				{subscribersLoading ? (
					<div className="p-12 text-center">
						<div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
				) : subscribersData && subscribersData.subscribers.length > 0 ? (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Email</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Source</TableHead>
									<TableHead>Subscribed</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subscribersData.subscribers.map((subscriber: any) => (
									<TableRow key={subscriber.id}>
										<TableCell className="font-medium">
											{subscriber.email}
										</TableCell>
										<TableCell>
											<Badge variant={subscriber.active ? "default" : "secondary"}>
												{subscriber.active ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-foreground/60">
											{subscriber.source}
										</TableCell>
										<TableCell className="text-foreground/60 text-sm">
											{new Date(subscriber.createdAt).toLocaleDateString()}
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleDelete(subscriber.id, subscriber.email)
												}
												className="text-destructive hover:text-destructive"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						{/* Pagination */}
						<div className="border-border/40 border-t p-4">
							<div className="flex items-center justify-between">
								<p className="text-foreground/60 text-sm">
									Showing {page * limit + 1} -{" "}
									{Math.min((page + 1) * limit, subscribersData.total)} of{" "}
									{subscribersData.total}
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handlePrevPage}
										disabled={page === 0}
									>
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleNextPage}
										disabled={!subscribersData.hasMore}
									>
										Next
									</Button>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="py-12 text-center">
						<Mail className="mx-auto h-12 w-12 text-foreground/20 mb-4" />
						<h3 className="font-medium text-foreground mb-1">
							No subscribers yet
						</h3>
						<p className="text-foreground/50 text-sm">
							Subscribers will appear here when people sign up.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
