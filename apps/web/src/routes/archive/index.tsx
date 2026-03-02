import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ChevronRight } from "lucide-react";
import { useQueryStates } from "nuqs";
import { PostCard } from "@/components/post/post-card";
import { PostCardGridSkeleton } from "@/components/skeletons/post-card-skeleton";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/archive/")({
  component: ArchiveComponent,
});

function ArchiveComponent() {
	const [{ year, month }, setFilters] = useQueryStates({
		year: {
			parse: (value) => (value ? parseInt(value, 10) : null),
			serialize: (value) => (value ? value.toString() : null),
		},
		month: {
			parse: (value) => (value ? parseInt(value, 10) : null),
			serialize: (value) => (value ? value.toString() : null),
		},
	});

	const {
		data: posts = [],
		isLoading,
		isError,
		error,
	} = useQuery(orpc.post.getPosts.queryOptions());

	// Group posts by year and month
	const groupedPosts = useMemo(() => {
		const groups = new Map<number, Map<number, typeof posts>>();

		for (const post of posts) {
			const date = new Date(post.createdAt);
			const postYear = date.getFullYear();
			const postMonth = date.getMonth() + 1; // 1-12

			if (!groups.has(postYear)) {
				groups.set(postYear, new Map());
			}

			const yearGroup = groups.get(postYear)!;
			if (!yearGroup.has(postMonth)) {
				yearGroup.set(postMonth, []);
			}

			yearGroup.get(postMonth)!.push(post);
		}

		// Sort years descending
		const sortedYears = Array.from(groups.entries()).sort(
			([a], [b]) => b - a,
		);

		// Sort months descending within each year
		for (const [, yearGroup] of groups) {
			const sortedMonths = Array.from(yearGroup.entries()).sort(
				([a], [b]) => b - a,
			);
			yearGroup.clear();
			for (const [month, posts] of sortedMonths) {
				yearGroup.set(month, posts);
			}
		}

		return groups;
	}, [posts]);

	// Get available years and months for filters
	const availableYears = useMemo(() => {
		return Array.from(groupedPosts.keys()).sort((a, b) => b - a);
	}, [groupedPosts]);

	const availableMonths = useMemo(() => {
		if (!year) return [];
		const yearGroup = groupedPosts.get(year);
		return yearGroup ? Array.from(yearGroup.keys()).sort((a, b) => b - a) : [];
	}, [groupedPosts, year]);

	// Filter posts based on selected year/month
	const filteredPosts = useMemo(() => {
		if (!year && !month) return posts;

		let result = posts;
		if (year) {
			result = result.filter((post) => {
				const postYear = new Date(post.createdAt).getFullYear();
				return postYear === year;
			});
		}
		if (month && year) {
			result = result.filter((post) => {
				const date = new Date(post.createdAt);
				return date.getMonth() + 1 === month;
			});
		}
		return result;
	}, [posts, year, month]);

	const clearFilters = () => {
		setFilters({ year: null, month: null });
	};

	const MONTH_NAMES = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	return (
		<main className="min-h-screen">
			<section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
				<header className="mb-8">
					<div className="flex items-center gap-2 mb-2">
						<Calendar className="h-5 w-5 text-primary" />
						<h1 className="font-semibold text-2xl text-foreground sm:text-3xl">
							Archive
						</h1>
					</div>
					<p className="mt-1 text-foreground/60 text-sm">
						Browse all posts by date. Filter by year and month.
					</p>
				</header>

				{/* Filters */}
				<nav
					className="mb-10 border-border/30 border-b pb-6"
					aria-label="Filter by date"
				>
					<p className="mb-3 text-foreground/60 text-xs uppercase tracking-wider">
						Filter by
					</p>
					<div className="flex flex-wrap items-center gap-4">
						{/* Year Filter */}
						<div className="flex items-center gap-2">
							<span className="text-foreground/50 text-sm">Year:</span>
							<div className="flex flex-wrap gap-2">
								{availableYears.map((y) => (
									<button
										key={y}
										onClick={() =>
											setFilters({ year: year === y ? null : y, month: null })
										}
										className={`rounded-full px-3 py-1 text-sm transition-colors ${
											year === y
												? "bg-primary text-primary-foreground"
												: "bg-accent/50 text-foreground/70 hover:bg-accent"
										}`}
									>
										{y}
									</button>
								))}
							</div>
						</div>

						{/* Month Filter (only show when year is selected) */}
						{year && availableMonths.length > 0 && (
							<>
								<span className="text-border">|</span>
								<div className="flex items-center gap-2">
									<span className="text-foreground/50 text-sm">Month:</span>
									<div className="flex flex-wrap gap-2">
										{availableMonths.map((m) => (
											<button
												key={m}
												onClick={() =>
													setFilters({ month: month === m ? null : m })
												}
												className={`rounded-full px-3 py-1 text-sm transition-colors ${
													month === m
														? "bg-primary text-primary-foreground"
														: "bg-accent/50 text-foreground/70 hover:bg-accent"
												}`}
											>
												{MONTH_NAMES[m - 1]}
											</button>
										))}
									</div>
								</div>
							</>
						)}

						{/* Clear Filters */}
						{(year || month) && (
							<>
								<span className="text-border">|</span>
								<button
									onClick={clearFilters}
									className="text-destructive text-sm hover:underline"
								>
									Clear filters
								</button>
							</>
						)}
					</div>
				</nav>
			</section>

			{/* Posts or Grouped View */}
			<section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
				{isLoading ? (
					<PostCardGridSkeleton count={6} />
				) : isError ? (
					<p className="text-foreground/50 text-sm">
						Couldn't load posts. {error?.message ?? "Try again later."}
					</p>
				) : year || month ? (
					// Show filtered posts as cards
					<>
						{filteredPosts.length > 0 ? (
							<div className="space-y-8">
								{filteredPosts.map((post) => (
									<PostCard key={post.id} post={post} />
								))}
							</div>
						) : (
							<p className="text-foreground/50 text-center text-sm">
								No posts found for the selected date range.
							</p>
						)}
					</>
				) : (
					// Show grouped by year/month when no filters
					<div className="space-y-12">
						{Array.from(groupedPosts.entries()).map(([y, yearGroup]) => (
							<div key={y}>
								<h2 className="font-semibold text-2xl text-foreground mb-6">
									{y}
								</h2>
								<div className="space-y-8">
									{Array.from(yearGroup.entries()).map(([m, monthPosts]) => (
										<div key={`${y}-${m}`} className="ml-4">
											<h3 className="font-medium text-lg text-foreground/80 mb-4 flex items-center gap-2">
												<ChevronRight className="h-4 w-4 text-primary" />
												{MONTH_NAMES[m - 1]}{" "}
												<span className="text-foreground/50 text-sm">
													({monthPosts.length} post
													{monthPosts.length !== 1 ? "s" : ""})
												</span>
											</h3>
											<div className="ml-6 space-y-6">
												{monthPosts.map((post) => (
													<PostCard key={post.id} post={post} />
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
